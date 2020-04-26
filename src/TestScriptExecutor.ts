import * as chalk from 'chalk';
import * as childProcess from 'child_process';
import { TestScriptExecutionOptions } from 'concordialang-plugin';
import { arrowRight, cross, info, warning } from 'figures';
import { access, constants, readFile, writeFile } from 'fs';
import * as fse from 'node-fs-extra';
import { isAbsolute, join } from 'path';
import { promisify } from 'util';
import { ConfigMaker } from './ConfigMaker';

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
        private readonly _defaultFrameworkConfig: object
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

        await this.assureConfigurationFile( executionPath );

        // Run CodeceptJS -------------------------------------------------------

        const cmd = this.makeCommand( options );
        showInfo( 'Running test scripts...' );
        writeln( ' ', textCommand( cmd ) );
        const code: number = await this.runCommand( cmd );

        // Output file ----------------------------------------------------------

        const OUTPUT_FILE_NAME = 'output.json';
        const outputFilePath = join( options.dirResult || '.', OUTPUT_FILE_NAME );
        showInfo( 'Retrieving results from', outputFilePath, '...' );

        return outputFilePath;
    }


    public makeCommand( options: TestScriptExecutionOptions ): string {

        let cmd = 'npx codeceptjs';

        const inParallel = options.instances && options.instances > 1;

        if ( inParallel ) {
            cmd += ' run-multiple parallel';
        } else {
            cmd += ' run';
        }

        // NOT NEEDED, IT'S ALREADY CONSIDERED IN --override :
        // cmd += ' -c codecept.json'; // load configuration file

        // Directory
        if ( !! options.dirScript && ! options.file ) {
            cmd += ` ${options.dirScript}`;
        }

        // Parameters
        // if ( !! options.parameters ) {
        //     cmd += ` ${options.parameters}`;
        // }

        // Grep
        if ( !! options.grep ) {
            cmd += ` --grep "${options.grep}"`;
        }

        // let browsers: string;
        // if ( !! options.targets ) {
        //     const browserNames = '\\\\"' +
        //         options.targets
        //             .split( ',' )
        //             .map( b => b.trim() )
        //             .join( '\\\\",\\\\"' ) +
        //         '\\\\"';
        //     browsers = `\\\\"browsers\\\\":[${browserNames}]`;
        // }

        if ( !! options.file ||
            !! options.dirResult ||
            inParallel ||
            !! options.target ||
            !! options.headless
            ) {

            // const overridePieces: string[] = [];
            // let overrideObj = {};
            let overrideObj = Object.assign( this._defaultFrameworkConfig || {}, {} );

            // console.log( 'BEFORE', overrideObj );

            if ( !! options.file ) {

                if ( ! options.dirScript ) {

                    const files = options.file.split( ',' );
                    const globPattern = files.length > 1
                        ? `{${options.file}}`
                        : options.file;

                    // overridePieces.push( `\\\\"tests\\\\":\\\\"${globPattern}\\\\"` );
                    overrideObj[ "tests" ] = globPattern;

                } else if ( ! options.grep ) {

                    const toUnixPath = path => path.replace( /\\\\?/g, '/' );

                    const files = ( options.file + '' )
                        .split( ',' )
                        // Make paths using the source code dir
                        // .map( f => toUnixPath( resolve( options.dirScripts, f ) ) );
                        .map( f => isAbsolute( f ) ? f : toUnixPath( join( options.dirScript, f ) ) )
                        ;

                    const fileNamesSeparatedByComma = files.length > 1 ? files.join( ',' ) : files[ 0 ];

                    // const globPattern = `${options.dirScripts}/**/*/{${fileNamesSeparatedByComma}}.js`;
                    const globPattern = files.length > 1
                        ? `{${fileNamesSeparatedByComma}}`
                        : fileNamesSeparatedByComma;

                    // overridePieces.push( `\\\\"tests\\\\":\\\\"${globPattern}\\\\"` );
                    overrideObj[ "tests" ] = globPattern;
                }
            }

            if ( !! options.dirResult ) {
                // overridePieces.push( `\\\\"output\\\\":\\\\"${options.dirResults}\\\\"` );
                overrideObj[ "output" ] = options.dirResult;
            }

            if ( inParallel ) {

                // const multiple = browsers
                //     ? `\\\\"multiple\\\\":{\\\\"parallel\\\\":{\\\\"chunks\\\\":${options.instances},${browsers}}}`
                //     : `\\\\"multiple\\\\":{\\\\"parallel\\\\":{\\\\"chunks\\\\":${options.instances}}}`;

                // overridePieces.push( multiple );

                overrideObj[ "multiple" ] = {
                    "parallel": {
                        "chunks": options.instances,
                        "browsers": options.target ? options.target.split( ',' ).map( b => b.trim() ) : undefined
                    }
                };

            // } else if ( browsers ) {
            //     overridePieces.push( browsers );
            // }
            } else if ( options.target ) {

                // Helper for WebDriverIO has a property "browser" that accepts
                // only one browser.
                //
                // CodeceptJS has an experimental "multiremote" configuration
                // that uses WebDriverIO's new capabilities that offer support
                // for multiple browsers.
                //
                // @see https://codecept.io/helpers/WebDriver/#multiremote-capabilities
                // @see http://webdriver.io/guide/usage/multiremote.html
                //
                if ( overrideObj[ 'helpers' ] && overrideObj[ 'helpers' ][ 'WebDriverIO' ] ) {

                    const browsersArray = options.target.split( ',' ).map( b => b.trim() );

                    const wdio = overrideObj[ 'helpers' ][ 'WebDriverIO' ];

                    if ( 1 === browsersArray.length ) {
                        wdio[ 'browser' ] = browsersArray[ 0 ];
                    } else {
                        const multiremoteCfg  = {};
                        for ( const browser of browsersArray ) {
                            multiremoteCfg[ browser ] = {
                                "desiredCapabilities": {
                                    "browserName": browser
                                }
                            };
                        }
                        wdio[ 'multiremote' ] = multiremoteCfg;
                    }
                }
            }

            if ( options.headless && overrideObj[ 'helpers' ] && overrideObj[ 'helpers' ][ 'WebDriverIO' ] ) {

                const wdio = overrideObj[ 'helpers' ][ 'WebDriverIO' ];
                wdio[ 'desiredCapabilities' ] = wdio[ 'desiredCapabilities' ] || {};
                const cap = wdio[ 'desiredCapabilities' ];

                if ( 'chrome' === wdio[ 'browser' ] ) {
                    cap[ 'browserName' ] = 'chrome';
                    cap[ 'chromeOptions' ] = {
                        "args": [
                            "--headless",
                            "--disable-gpu",
                            "--no-sandbox",
                            "--proxy-server='direct://'",
                            "--proxy-bypass-list=*"
                        ]
                    };
                } else if ( 'firefox' === wdio[ 'browser' ] ) {
                    cap[ 'browserName' ] = 'firefox';
                    cap[ 'moz:firefoxOptions' ] = {
                        "args": [
                            "-headless"
                        ]
                    };
                }

            }

            // console.log( 'AFTER', overrideObj );

            // cmd += ' --override "{' + overridePieces.join( ',' ) + '}"';

            const isEmptyObject = '{}' === JSON.stringify( overrideObj );

            if ( ! isEmptyObject ) {

                const overrideStr = JSON.stringify( overrideObj, undefined, '' )
                    .replace( /"/g, '\\\\\\\"' );

                cmd += ` --override "${overrideStr}"`;
            }
        }

        cmd += ' --steps';

        const outputDir = options.dirResult || 'output';

        let reporter = 'mocha-multi';
        // let reporter = 'mochawesome';
        if ( 'mocha-multi' === reporter ) {
            // cmd += ` --reporter mocha-multi --reporter-options json=${outputDir}/output.json,doc=${outputDir}/output.html`;
            cmd += ` --reporter mocha-multi`;
        } else { // if ( 'mochawesome' === reporter ) {
            cmd += ` --reporter mochawesome --reporter-options reportDir=${outputDir},reportFilename=output.json`;
        }


        cmd += inParallel ? ' || echo .' : ' --colors || echo .';

        return cmd;
    }


    private async fileExists( path: string ): Promise< boolean > {
        try {
            const accessFile = promisify( access );
            await accessFile( path, constants.F_OK );
            return true;
        } catch ( e ) {
            return false;
        }
    }


    public async assureConfigurationFile( executionPath: string ): Promise< boolean > {

        const writeF = promisify( writeFile );

        const codeceptJSConfigFile = join( executionPath, 'codecept.json' );
        const configFileExists: boolean = await this.fileExists( codeceptJSConfigFile );

        // It's only possible to run CodeceptJS if there is a config file
        if ( ! configFileExists ) {

            try {
                const json = JSON.stringify( this._defaultFrameworkConfig, undefined, "\t" );
                await writeF( codeceptJSConfigFile, json );
            } catch ( e ) {
                writeln( iconError, textColor( 'Could not generate' ), highlight( codeceptJSConfigFile ) + '.', textColor( 'Please run the following command:' ) );
                writeln( textColor( '  codeceptjs init' ) );
                return false;
            }

            showInfo( 'Generated configuration file', codeceptJSConfigFile );
            writeln( arrowRight, textColor( 'If this file does not work for you, delete it and then run:' ) );
            writeln( textColor( '  codeceptjs init' ) );

        } else { // exists

            // Let's check needed dependencies
            let config = {};
            try {
                const readF = promisify( readFile );
                const content = await readF( codeceptJSConfigFile );
                config = JSON.parse( content.toString() );

                showInfo( 'Configuration file', codeceptJSConfigFile );
            } catch ( e ) {
                writeln( iconError, textColor( 'Could not read' ), highlight( codeceptJSConfigFile ) );
                return false;
            }

            const cfgMaker = new ConfigMaker();

            let needsToWriteConfig: boolean = ! cfgMaker.hasHelpersProperty( config );

            if ( ! cfgMaker.hasCmdHelper( config ) ) {
                cfgMaker.setCmdHelper( config );
                needsToWriteConfig = true;
            }

            if ( ! cfgMaker.hasDbHelper( config ) ) {
                cfgMaker.setDbHelper( config );
                needsToWriteConfig = true;
            }

            if ( needsToWriteConfig ) {
                try {
                    await writeF( codeceptJSConfigFile, JSON.stringify( config ) );
                    showInfo( 'Updated configuration file', codeceptJSConfigFile );
                } catch ( e ) {
                    writeln( iconError, textColor( 'Error updating configuration file' ), highlight( codeceptJSConfigFile ) + '. Please check if it has DbHelper and CmdHelper configured.' );
                    return false;
                }
            }
        }

        return true;
    }

    // private escapeJson( json: string ): string {
    //     return JSON.stringify( { _: json} ).slice( 6, -2 );
    // }

    private async runCommand(
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
