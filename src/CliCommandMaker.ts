import { TestScriptExecutionOptions } from 'concordialang-plugin';
import { isAbsolute, join } from 'path';

/**
 * Add wildcard to JS files to the given path.
 *
 * @param path Path
 */
export function addJS( path: string ): string {

	if ( ! path || /(\.js|\)|\})$/i.test( path ) ) {
		return path;
	}

	const isUnix = path.includes( '/' );
	if ( isUnix ) {
		if ( path.endsWith( '/' ) ) {
			return path + '**/*.js';
		}
		return path + '/**/*.js';
	}

	const isWin = path.includes( '\\' );
	if ( isWin ) {
		if ( path.endsWith( '\\' ) ) {
			return path + '**\\*.js';
		}
		return path + '\\**\\*.js';
	}

	return path + '/**/*.js';
}

export class CliCommandMaker {

    constructor(
        private readonly _defaultFrameworkConfig: any
    ) {
    }

    public makeCmd( options: TestScriptExecutionOptions ): string {
        const [ cmd ] = this.makeCommand( options );
        return cmd;
    }

    /**
     * Make a command to execute.
     *
     * @param options Execution options
     * @returns [ string, boolean, object ] with:
     *  - the command
     *  - whether it must generate a configuration backup file
     *  - produced configuration object
     *
     */
    public makeCommand( options: TestScriptExecutionOptions ): [ string, boolean, object ] {

        let backupFile: boolean = false;
        let obj = undefined;
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
        if ( ! inParallel && !! options.dirScript && ! options.file ) {
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

		// Add browsers for parallel execution whether needed
		let browsersForParallel: string[] = [];
		if ( inParallel ) {
			// If target is NOT defined, collect browser from helpers
			if ( ! options.target ) {
				if ( this._defaultFrameworkConfig &&
					this._defaultFrameworkConfig[ 'helpers' ]
				) {
					for ( const [ , v ] of Object.entries( this._defaultFrameworkConfig[ 'helpers' ] ) ) {
						const browser = v[ 'browser' ];
						if ( browser && ! browsersForParallel.includes( browser ) ) {
							browsersForParallel.push( browser );
						}
					}
				}
			} else {
				browsersForParallel = options.target.split( ',' ).map( b => b.trim() );
			}

		}

		const overrideObj = Object.assign( {}, this._defaultFrameworkConfig );

		// Makes the helper use the target browser, whether a target is defined
		// and it is not a parallel execution.
		const isToChangeBrowser = options.target && ! inParallel;
		const isToChangeShowToFalse = true === options.headless;
		if ( isToChangeBrowser || isToChangeShowToFalse ) {
			if ( overrideObj[ 'helpers' ] ) {
				for ( const [ , v ] of Object.entries( overrideObj[ 'helpers' ] ) ) {

					if ( isToChangeBrowser && v[ 'browser' ] ) {
						const [ firstTarget ] = options.target.split( ',' );
						v[ 'browser' ] = firstTarget;
					}

					if ( isToChangeShowToFalse && v[ 'show' ] ) {
						v[ 'show' ] = false;
					}

				}
			}
		}

		// Include browsers for parallel if not defined. That's not depend on the parallel flag !
		if ( overrideObj[ 'multiple' ] &&
			overrideObj[ 'multiple' ][ 'parallel' ] &&
			! overrideObj[ 'multiple' ][ 'parallel' ][ 'browsers' ] &&
			browsersForParallel.length > 0
		) {
			overrideObj[ 'multiple' ][ 'parallel' ][ 'browsers' ] = browsersForParallel;
		}


		if ( options.dirScript &&
			! options.file &&
			 // ! options.grep &&
			overrideObj[ 'tests' ]
		) {
			overrideObj[ 'tests' ] = addJS( options.dirScript );
		}


        if ( options.file ||
			options.dirResult ||
            inParallel ||
            options.target ||
            options.headless
            ) {

            // console.log( 'BEFORE', overrideObj );

            if ( options.file ) {

                if ( ! options.dirScript ) {

                    const files = options.file.split( ',' );
                    const globPattern = files.length > 1
                        ? `{${options.file}}`
                        : options.file;
                    // overridePieces.push( `\\\\"tests\\\\":\\\\"${globPattern}\\\\"` );
                    overrideObj[ 'tests' ] = globPattern;

                } else if ( ! options.grep ) {

					if ( ! options.file || '' === options.file.toString().trim() ) {
						overrideObj[ 'tests' ] = addJS( options.dirScript );
					} else {

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
						overrideObj[ 'tests' ] = globPattern;
					}
                }
            } else {
				overrideObj[ 'tests' ] = addJS( options.dirScript );
			}

            if ( !! options.dirResult ) {
                // overridePieces.push( `\\\\"output\\\\":\\\\"${options.dirResults}\\\\"` );
                overrideObj[ 'output' ] = options.dirResult;
            }

            if ( inParallel ) {

                // const multiple = browsers
                //     ? `\\\\"multiple\\\\":{\\\\"parallel\\\\":{\\\\"chunks\\\\":${options.instances},${browsers}}}`
                //     : `\\\\"multiple\\\\":{\\\\"parallel\\\\":{\\\\"chunks\\\\":${options.instances}}}`;

				// overridePieces.push( multiple );

				const browsersToUse = browsersForParallel.length > 0
					? browsersForParallel : undefined;

                overrideObj[ 'multiple' ] = {
                    "parallel": {
						"chunks": options.instances,
						"browsers": browsersToUse,
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

            const jsonOverrideObj = JSON.stringify( overrideObj, undefined, '' );
            const jsonConfig = JSON.stringify( this._defaultFrameworkConfig, undefined, '' );

			if ( jsonOverrideObj !== jsonConfig ) {

				const overrideStr = jsonOverrideObj.replace( /"/g, '\\\\\\\"' );

				//
				// CodeceptJS has a bug in which it does not accept a JSON
				// with one or more spaces. Thus, as a workaround, we can
				// create a copy the original configuration file, overwrite the
				// original with the desired configuration, then restore it.
				//

				if ( overrideStr.indexOf( ' ' ) < 0 ) {
					cmd += ` --override "${overrideStr}"`;
				} else {
					backupFile = true;
					obj = overrideObj;
				}

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


		const complement = ''; // ' || echo .';
		cmd += inParallel ? complement : ' --colors' + complement;

        return [ cmd, backupFile, obj ];
    }


}
