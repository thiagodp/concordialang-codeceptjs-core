import { AbstractTestScript, Plugin, TestScriptExecutionOptions, TestScriptExecutionResult, TestScriptGenerationOptions } from 'concordialang-plugin';
import * as fs from 'fs';
import * as fse from 'node-fs-extra';
import { basename, dirname, join, relative, resolve } from 'path';
import { promisify } from 'util';
import { CommandMapper } from './CommandMapper';
import { CODECEPTJS_COMMANDS } from './Commands';
import { ConfigMaker } from './ConfigMaker';
import { ReportConverter } from './ReportConverter';
import { TestScriptExecutor } from './TestScriptExecutor';
import { TestScriptGenerator } from './TestScriptGenerator';

/**
 * Plugin for CodeceptJS.
 */
export abstract class CodeceptJS implements Plugin {

    private readonly _descriptorPath: string;
    private readonly _fs: any;

    /**
     * Constructor
     *
     * @param descriptorPath Path of the plugin descriptor file.
     * @param fsToUse Filesystem object to use. Default is nodejs fs.
     * @param _encoding Encoding to use. Default is 'utf8'.
     */
    constructor(
        descriptorPath?: string,
        fsToUse?: any,
        private _encoding: string = 'utf8'
    ) {
        this._descriptorPath = descriptorPath || join( __dirname, '../', 'codeceptjs.json' );
        this._fs = ! fsToUse ? fs : fsToUse;
    }

    /** @inheritDoc */
    public async generateCode(
        abstractTestScripts: AbstractTestScript[],
        options: TestScriptGenerationOptions,
        errors: Error[]
    ): Promise< string[] > {

        const scriptGenerator = this.createTestScriptGenerator( options.specificationDir );

        let files: string[] = [];
        for ( let ats of abstractTestScripts || [] ) {

            const outputFilePath: string = this.createFilePath(
                options.sourceCodeDir, ats.sourceFile, options.specificationDir );

            try {
                await this.ensureDir( dirname( outputFilePath ) );

                const code: string = scriptGenerator.generate( ats );

                await this.writeFile( outputFilePath, code );

                files.push( outputFilePath );
            } catch ( e ) {
                const msg = 'Error generating script for "' + ats.sourceFile + '": ' + e.message;
                errors.push( new Error( msg ) );
            }
        }
        return files;
    }

    /** @inheritDoc */
    public async executeCode( options: TestScriptExecutionOptions ): Promise< TestScriptExecutionResult > {
        const scriptExecutor = this.createTestScriptExecutor( options );
        const path = await scriptExecutor.execute( options );
        return await this.convertReportFile( path );
    }

    /** @inheritDoc */
    public async convertReportFile( filePath: string ): Promise< TestScriptExecutionResult > {
        const reportConverter = new ReportConverter( this._fs, this._encoding );
        return await reportConverter.convertFrom( filePath, this._descriptorPath );
    }

    /** @inheritDoc */
    public async defaultReportFile(): Promise< string > {
        return 'output.json';
    }

    /**
     * Creates a test script file path.
     *
     * @param targetDir Target directory, e.g. `tests`
     * @param specFilePath Specification file, e.g. `path/to/features/sub1/sub2/f1.testcase`
     * @param specDir Specification directory, e.g. `path/to/features/`
     */
    private createFilePath(
        targetDir: string,
        specFilePath: string,
        specDir?: string
    ): string {

        const relSpecFilePath: string = specDir
            ? relative( specDir, specFilePath )
            : specFilePath;

        const outputDir: string = specDir
            ? resolve( targetDir, dirname( relSpecFilePath ) )
            : targetDir;

        const fileName: string = basename( relSpecFilePath, '.testcase' ) + '.js';

        return join( outputDir, fileName );
    }

    private async ensureDir( dir: string ): Promise< void > {
        if ( this._fs != fs ) {
            return;
        }
        await fse.mkdirs( dir );
    }

    private async writeFile( path: string, content: string ): Promise< void > {
        const write = promisify( this._fs.writeFile || fs.writeFile );
        await write( path, content, this._encoding );
    }

    protected createTestScriptGenerator( specificationDir?: string): TestScriptGenerator {
        return new TestScriptGenerator(
            new CommandMapper( CODECEPTJS_COMMANDS ),
            specificationDir
        );
    }

    protected createTestScriptExecutor( options: TestScriptExecutionOptions ): TestScriptExecutor {

        const scriptFileFilter = join( options.sourceCodeDir, '**/*.js' );

        const cfgMaker: ConfigMaker = new ConfigMaker();
        let config = cfgMaker.makeBasicConfig(
            scriptFileFilter,
            options.executionResultDir
        );
        cfgMaker.setWebDriverIOHelper( config );
        cfgMaker.setDbHelper( config );
        cfgMaker.setCmdHelper( config );

        return new TestScriptExecutor( config );
    }

}
