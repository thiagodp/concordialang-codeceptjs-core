import * as chalk from 'chalk';
import * as childProcess from 'child_process';
import { TestScriptExecutionOptions } from 'concordialang-plugin';
import { arrowRight, cross, info, warning } from 'figures';
import { access, constants, readFile, unlink, writeFile } from 'fs';
import * as fse from 'node-fs-extra';
import { join } from 'path';
import { promisify } from 'util';
import { CliCommandMaker } from './CliCommandMaker';
import { CmdHelperConfiguration } from './CmdHelperConfiguration';
import { ConfigMaker } from './ConfigMaker';
import { DbHelperConfiguration } from './DbHelperConfiguration';
import { HelperConfiguration } from './HelperConfiguration';

// UI ----------------------------------

const iconInfo = chalk.blueBright( info );
const iconWarning = chalk.yellow( warning );
const iconError = chalk.redBright( cross );

const textColor = chalk.cyanBright;
const textCommand = chalk.cyan;
const highlight = chalk.yellowBright;

const writeln = ( ...args ) => {
    console.log( ...args );
};

const showInfo = ( title: string, content?: string, addition?: string ): void => {
    if ( content ) {
        writeln( iconInfo, textColor( title ), highlight( content ) + ( addition ? textColor( addition ) : '' ) );
    } else {
        writeln( iconInfo, textColor( title ) );
    }
};

// -------------------------------------


/**
 * Executes test scripts using CodeceptJS.
 */
export class TestScriptExecutor {

    constructor(
        private readonly _additionalHelpers: Array< HelperConfiguration > = []
    ) {
    }

    /**
     * Executes the script according to the options given.
     *
     * @param options Execution options
     */
    public async execute( options: TestScriptExecutionOptions ): Promise< string > {

        // Creates the source code dir if it does not exist
        if ( !! options.dirScript ) {
            showInfo( 'Test scripts in', options.dirScript );
            await fse.mkdirs( options.dirScript );
        }

        // Creates the execution result/output dir if it does not exist
        if ( !! options.dirResult ) {
            showInfo( 'Results in', options.dirResult );
            await fse.mkdirs( options.dirResult );
        }

        const executionPath = process.cwd();

        // codecept.json -------------------------------------------------------

        const codeceptJSConfigFile = join( executionPath, 'codecept.json' );

        let configFileExists: boolean = await this.fileExists( codeceptJSConfigFile );

        let config: any;

        // It's only possible to run CodeceptJS if there is a config file
        if ( ! configFileExists ) {
            config = this.createBasicConfiguration( options );
            configFileExists = await this.writeConfigurationFile( codeceptJSConfigFile, config, false );
        } else {
            config = await this.readConfigurationFile( codeceptJSConfigFile );
            if ( ! config ) {
                config = this.createBasicConfiguration( options );
            }
        }
        const changed = this.updateConfiguration( config, options );
        if ( changed ) {
            await this.writeConfigurationFile( codeceptJSConfigFile, config, true );
        }

        // Run CodeceptJS ------------------------------------------------------

        const commandMaker = new CliCommandMaker( config );
        const [ cmd, needsToCreateBackup, tempConfig ] = commandMaker.makeCommand( options );

        // Preparing backup file if needed
        //
        //      CodeceptJS' parameter --override has a bug in which it does not
        //      accept a JSON content with one or more spaces. As a workaround,
        //      we are creating a backup copy of the original configuration file
        //      and restoring it after executing the test scripts.
        //

        const backupFile = 'codecept-backup-' + Date.now() + '.json';
        let backupFileCreated: boolean = false;

        if ( configFileExists && needsToCreateBackup ) {
            try {
                // Create a backup copy
                await this.copyFile( codeceptJSConfigFile, backupFile );
                // Overwrite current configuration file
                await this.writeObjectToFile( codeceptJSConfigFile, tempConfig );
                // Indicate success
                backupFileCreated = true;
            } catch ( e ) {
                writeln( iconError, textColor( 'Error copying the configuration file' ), highlight( codeceptJSConfigFile ) );
            }
        }

        // Running the test scripts

        showInfo( 'Running test scripts...' );
        writeln( ' ', textCommand( cmd ) );
        const code: number = await this.runCommand( cmd );

        // Restoring the backup if needed

        if ( backupFileCreated ) {
            try {
                // Copy the backup file back
                await this.copyFile( backupFile, codeceptJSConfigFile );
                // Delete the backup file
                await this.deleteFile( backupFile );
            } catch ( e ) {
                writeln( iconError, textColor( 'Error restoring the backup file' ), highlight( backupFile ) );
            }
        }

        // Output file ---------------------------------------------------------

        const OUTPUT_FILE_NAME = 'output.json';
        const outputFilePath = join( options.dirResult || '.', OUTPUT_FILE_NAME );
        showInfo( 'Retrieving results from', outputFilePath, '...' );

        return outputFilePath;
    }

    protected createBasicConfiguration( options: TestScriptExecutionOptions ): any {
        const scriptFileFilter = join( options.dirScript, '**/*.js' );
        const cfgMaker = new ConfigMaker();
        const config = cfgMaker.makeBasicConfig( scriptFileFilter, options.dirResult );
        return config;
    }

    protected updateConfiguration( config: any, options: TestScriptExecutionOptions ): boolean {

        const helpers: Array< HelperConfiguration > = [
            new DbHelperConfiguration(),
            new CmdHelperConfiguration(),
            ...( this._additionalHelpers || [] )
        ];

        const cfgMaker = new ConfigMaker();

        let changed: boolean = false;
        for ( const helper of helpers ) {
            if ( ! cfgMaker.hasHelper( config, helper ) ) {
                cfgMaker.setHelper( config, helper, options );
                changed = true;
            }
        }

        return changed;
    }

    protected async writeConfigurationFile(
        codeceptJSConfigFile: string,
        config: any,
        isUpdate: boolean
    ): Promise< boolean > {

        try {
            await this.writeObjectToFile( codeceptJSConfigFile, config );
        } catch ( e ) {
            if ( isUpdate ) {
                writeln( iconError, textColor( 'Error updating configuration file' ),
                    highlight( codeceptJSConfigFile ) +
                    '. Please check if it has DbHelper and CmdHelper configured.' );
            } else {
                writeln( iconError, textColor( 'Could not generate' ), highlight( codeceptJSConfigFile ) + '.', textColor( 'Please run the following command:' ) );
                writeln( textColor( '  codeceptjs init' ) );
            }
            return false;
        }

        if ( isUpdate ) {
            showInfo( 'Updated configuration file', codeceptJSConfigFile );
        } else {
            showInfo( 'Generated configuration file', codeceptJSConfigFile );
            writeln( arrowRight, textColor( 'If this file does not work for you, delete it and then run:' ) );
            writeln( textColor( '  codeceptjs init' ) );
        }

        return true;
    }


    protected async readConfigurationFile(
        codeceptJSConfigFile: string
    ): Promise< any > {
        let config = null;
        try {
            const readF = promisify( readFile );
            const content = await readF( codeceptJSConfigFile );
            config = JSON.parse( content.toString() );

            showInfo( 'Configuration file', codeceptJSConfigFile );
        } catch ( e ) {
            writeln( iconError, textColor( 'Could not read' ), highlight( codeceptJSConfigFile ) );
            return null;
        }
        return config;
    }


    protected async fileExists( path: string ): Promise< boolean > {
        try {
            const accessFile = promisify( access );
            await accessFile( path, constants.F_OK );
            return true;
        } catch ( e ) {
            return false;
        }
    }

    protected async writeObjectToFile( path: string, obj: object ): Promise< void > {
        const writeF = promisify( writeFile );
        const json = JSON.stringify( obj, undefined, "\t" );
        await writeF( path, json );
    }

    protected async copyFile( from: string, to: string ): Promise< void > {
        const readF = promisify( readFile );
        const writeF = promisify( writeFile );
        const content = await readF( from, { encoding:'utf8' } );
        await writeF( to, content, { encoding:'utf8', flag: 'w+' } );
    }

    protected async deleteFile( path: string ): Promise< void > {
        const unlinkF = promisify( unlink );
        await unlinkF( path );
    }


    // protected escapeJson( json: string ): string {
    //     return JSON.stringify( { _: json} ).slice( 6, -2 );
    // }

    protected async runCommand(
        command: string
    ): Promise< number > {

        let options = {
            // stdio: 'inherit', // <<< not working on windows!
            shell: true
        };

        // Splits the command into pieces to pass to the process;
        //  mapping function simply removes quotes from each piece
        let cmds = command.match( /[^"\s]+|"(?:\\\\"|[^"])+"/g )
            .map( expr => {
                return expr.charAt( 0 ) === '"' && expr.charAt( expr.length - 1 ) === '"' ? expr.slice( 1, -1 ) : expr;
            } );
        const runCMD = cmds[ 0 ];
        cmds.shift();

        return new Promise< number >( ( resolve, reject ) => {

            const child = childProcess.spawn( runCMD, cmds, options );

            child.stdout.on( 'data', ( chunk ) => {
                console.log( chunk.toString() );
            } );

            child.stderr.on( 'data', ( chunk ) => {
                console.warn( chunk.toString() );
            } );

            child.on( 'exit', ( code ) => {
                resolve( code );
            } );

        } );
    }

}
