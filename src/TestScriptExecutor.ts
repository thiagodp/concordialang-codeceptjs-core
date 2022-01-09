import * as chalk from 'chalk';
import { TestScriptExecutionOptions } from 'concordialang-plugin';
import { arrowRight, cross, info, warning } from 'figures';
import { readFile, writeFile } from 'fs';
import * as fse from 'node-fs-extra';
import { isAbsolute, join } from 'path';
import { promisify } from 'util';

import { Codecept } from './cjs';
import { CmdHelperConfiguration } from './CmdHelperConfiguration';
import { ConfigMaker } from './ConfigMaker';
import { DbHelperConfiguration } from './DbHelperConfiguration';
import { HelperConfiguration } from './HelperConfiguration';
import { addJSWildcard } from './wildcard';

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


        //
        // Load configuration file
        //

        let configFile: string | undefined;
        const jsonConfigFile = join( executionPath, 'codecept.json' );
        const jsConfigFile = './codecept.conf.js';
        const readF = promisify( readFile );
        let cfgFileType: 'none' | 'json' | 'js' = 'none';
        let cfg;

        // Read JSON config file
        try {
            const jsonContent = await readF( jsonConfigFile, { encoding: 'UTF-8' } );
            cfg = JSON.parse( jsonContent.toString() );
            cfgFileType = 'json';
            configFile = jsonConfigFile;
        } catch {
            // ignore - JSON config file not found
        }

        // Read JS config file if the JSON file was not found
        if ( ! cfg ) {
            try {
                const jsContent = await require( jsConfigFile );
                cfg = jsContent.config;
                cfgFileType = 'js';
                configFile = jsConfigFile;
            } catch {
                // ignore - JS config file not found
            }
        }

        // Create a basic JSON configuration file if none exists

        if ( ! cfg ) {
            writeln( iconWarning, textColor( 'No CodeceptJS configuration file was found (codecept.json or codecept.conf.js).' ) );
            writeln( iconInfo, textColor( 'Creating' ), highlight( jsonConfigFile ), textColor( 'for you...' ) );
            cfg = this.createBasicConfiguration( options );

            // Add Helpers
            this.addHelpers( cfg, options );

            await this.writeJsonConfigurationFile( jsonConfigFile, cfg, false );

        // Add helpers
        } else {

            showInfo( 'Configuration file', configFile || 'not found' );
            const changed: boolean = this.addHelpers( cfg, options ); // Add Helpers

            // Rewrite the JSON configuration file if needed
            // TO-DO: Allow to update a JS config file
            if ( changed && 'json' == cfgFileType ) {
                await this.writeJsonConfigurationFile( jsonConfigFile, cfg, true );
            }
        }

        //
        // Adjust configuration from Concordia parameters
        //

        const isInParallel = options.instances && options.instances > 1;

		let configuredBrowsers: string[] = [];

		if ( options.target ) {
			configuredBrowsers = options.target.split( ',' ).map( b => b.trim() );
		} else {
			// Collect browser from helpers
			if ( cfg[ 'helpers' ] ) {
				for ( const [ , v ] of Object.entries( cfg[ 'helpers' ] ) ) {
                    const o = v as any;
					const browser = o[ 'browser' ];
					if ( browser && ! configuredBrowsers.includes( browser ) ) {
						configuredBrowsers.push( browser );
					}
				}
			}
		}

		if ( isInParallel ) {

            // Include browsers for parallel if not defined. That's not depend on the parallel flag !
            if ( configuredBrowsers.length > 0 ) {
                cfg[ 'multiple' ] = {
                    "parallel": {
                        "chunks": options.instances,
                        "browsers": configuredBrowsers,
                    }
                };
            }


		} else { // Not in parallel

            // Change the helpers to use the target browser when
            // a target browser is defined and it is not parallel execution.

            if ( cfg[ 'helpers' ] && ( options.target || true === options.headless ) ) {

                const [ firstTargetBrowser ] = configuredBrowsers;

                for ( const [ , v ] of Object.entries( cfg[ 'helpers' ] ) ) {

                    const o = v as any;

                    if ( options.target && o[ 'browser' ] ) {
                        o[ 'browser' ] = firstTargetBrowser;
                    }

                    if ( true === options.headless && o[ 'show' ] ) {
                        o[ 'show' ] = false;
                    }

                }
            }
        }


        // Define (result) output directory if defined
        if ( !! options.dirResult ) {
            cfg[ 'output' ] = options.dirResult;
        }


        // Define wildcard to JS files if not file is detected
        if ( ! options.file || '' === options.file.toString().trim() ) {
            cfg[ 'tests' ] = addJSWildcard( options.dirScript! );

        // Create glob for file name
        } else {

            if ( ! options.dirScript ) { // No directory -> use glob for a single or multiple files

                const files = options.file.split( ',' );
                const globPattern = files.length > 1 ? `{${options.file}}` : options.file;
                cfg[ 'tests' ] = globPattern;

            } else if ( ! options.grep ) { // No grep -> separate files, add full path, and make glob

                const toUnixPath = path => path.replace( /\\\\?/g, '/' );

                const files = ( options.file + '' )
                    .split( ',' )
                    // Make paths using the source code dir
                    // .map( f => toUnixPath( resolve( options.dirScripts, f ) ) );
                    .map( f => isAbsolute( f ) ? f : toUnixPath( join( options.dirScript!, f ) ) )
                    ;

                const fileNamesSeparatedByComma = files.length > 1 ? files.join( ',' ) : files[ 0 ];

                const globPattern = files.length > 1
                    ? `{${fileNamesSeparatedByComma}}`
                    : fileNamesSeparatedByComma;

                cfg[ 'tests' ] = globPattern;

            }

        }

        // Playwright - Fix browser from 'chrome' to 'chromium' whether defined

        if ( 'chrome' === options.target && cfg[ 'helpers' ] && cfg[ 'helpers' ][ 'Playwright' ] ) {
            options.target = 'chromium';
            writeln( iconWarning, 'Playwright does not support "chrome" but "chromium". Please fix it to remove this warning. Using "chromium".' );
        }


        // WebDriverIO - experimental "multiremote" configuration for multiple browsers.
        // @see https://codecept.io/helpers/WebDriver/#multiremote-capabilities
        // @see http://webdriver.io/guide/usage/multiremote.html

        if ( options.target && cfg[ 'helpers' ] && cfg[ 'helpers' ][ 'WebDriverIO' ] ) {

            const browsersArray = options.target.split( ',' ).map( b => b.trim() );
            const wdio = cfg[ 'helpers' ][ 'WebDriverIO' ];

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

        // WebDriverIO - Headless mode changes

        if ( options.headless && cfg[ 'helpers' ] && cfg[ 'helpers' ][ 'WebDriverIO' ] ) {

            const wdio = cfg[ 'helpers' ][ 'WebDriverIO' ];
            wdio[ 'desiredCapabilities' ] = wdio[ 'desiredCapabilities' ] || {};
            const dc = wdio[ 'desiredCapabilities' ];

            if ( 'chrome' === wdio[ 'browser' ] ) {
                dc[ 'browserName' ] = 'chrome';
                dc[ 'chromeOptions' ] = {
                    "args": [
                        "--headless",
                        "--disable-gpu",
                        "--no-sandbox",
                        "--proxy-server='direct://'",
                        "--proxy-bypass-list=*"
                    ]
                };
            } else if ( 'firefox' === wdio[ 'browser' ] ) {
                dc[ 'browserName' ] = 'firefox';
                dc[ 'moz:firefoxOptions' ] = {
                    "args": [
                        "-headless"
                    ]
                };
            }
        }

        //
        // Default CodeceptJS options
        //

        const defaultConfig = {
            output: './_output',
            helpers: {},
            include: {},
            mocha: {},
            bootstrap: null,
            teardown: null,
            hooks: [],
            gherkin: {}, // { features: string[] }
            plugins: {
                screenshotOnFail: {
                    enabled: true, // will be disabled by default in 2.0
                },
            },

            // OTHER OPTIONS:
            require: undefined, // string[]
            noGlobals: undefined, // boolean
            tests: undefined, // string

        };

        const defaultCliOptions = {
            profile: undefined,
            features: undefined,
            tests: undefined,

            override: undefined,

            // mocha opts
            grep: undefined,
            reporter: undefined, // string
            reporterOptions: undefined, // string
        };


		// Mocha Awesome reports
		// https://codecept.io/reports/#html

		let mocha = cfg[ 'mocha' ];
		if ( ! mocha ) {
			mocha = cfg[ 'mocha' ] = {};
		}

		let reporterOptions = mocha[ 'reporterOptions' ];
		if ( ! reporterOptions ) {
			reporterOptions = mocha[ 'reporterOptions' ] = {};
		}

		if ( ! reporterOptions[ 'reportDir' ] ) {
			reporterOptions[ 'reportDir' ] = options.dirResult;
		}

		// OVERRIDES

        const overrideCliOptions = {
            grep: options.grep,
            override: cfg,
			// reporter: 'json',
			// reporterOptions: `stdout=${options.dirResult}/output.json`
			reporter: 'mochawesome',
			reporterOptions: `json=true,reportDir=${options.dirResult},reportFilename=output`
        };

        const finalCodeceptConfig = { ...defaultConfig, ...cfg };
        const finalCliOptions = { ...defaultCliOptions, ...overrideCliOptions };

        // console.log( finalCodeceptConfig );

        //
        // Execution
        //

        const codecept = new Codecept( finalCodeceptConfig, finalCliOptions );
        let error: boolean = false;
        try {
            codecept.init( executionPath );
            await codecept.bootstrap();
            codecept.loadTests();
            await codecept.run();
        } catch ( err ) {
            error = true;
            const e = err as Error;
            writeln( iconError, e.message ? e.message : err );
        } finally {
            await codecept.teardown();
        }

        //
        // Output file
        //

        return error ? '' : join( options.dirResult || '.', 'output.json' );
    }


    protected createBasicConfiguration( options: TestScriptExecutionOptions ): any {
        const scriptFileFilter = addJSWildcard( options.dirScript! );
        const cfgMaker = new ConfigMaker();
        const config = cfgMaker.makeBasicConfig( scriptFileFilter, options.dirResult );
        return config;
    }


    protected addHelpers( config: any, options: TestScriptExecutionOptions ): boolean {

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


    protected async writeJsonConfigurationFile(
        jsonFileName: string,
        config: any,
        isUpdate: boolean
    ): Promise< boolean > {

        const writeF = promisify( writeFile );
        try {
            const json = JSON.stringify( config, undefined, "\t" );
            await writeF( jsonFileName, json );

        } catch ( e ) {
            if ( isUpdate ) {
                writeln( iconError, textColor( 'Error updating configuration file' ),
                    highlight( jsonFileName ) +
                    '. Please check if DbHelper and CmdHelper helpers are configured in CodeceptJS configuration file.' );
            } else {
                writeln( iconError, textColor( 'Could not generate' ), highlight( jsonFileName ) + '.', textColor( 'Please run the following command:' ) );
                writeln( textColor( '  codeceptjs init' ) );
            }
            return false;
        }

        if ( isUpdate ) {
            showInfo( 'Updated configuration file', jsonFileName );
        } else {
            showInfo( 'Generated configuration file', jsonFileName );
            writeln( arrowRight, textColor( 'If this file does not work for you, delete it and then run:' ) );
            writeln( textColor( '  codeceptjs init' ) );
        }

        return true;
    }

}
