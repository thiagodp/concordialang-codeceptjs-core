"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CliCommandMaker = void 0;
const path_1 = require("path");
class CliCommandMaker {
    constructor(_defaultFrameworkConfig) {
        this._defaultFrameworkConfig = _defaultFrameworkConfig;
    }
    makeCmd(options) {
        const [cmd] = this.makeCommand(options);
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
    makeCommand(options) {
        let backupFile = false;
        let obj = undefined;
        let cmd = 'npx codeceptjs';
        const inParallel = options.instances && options.instances > 1;
        if (inParallel) {
            cmd += ' run-multiple parallel';
        }
        else {
            cmd += ' run';
        }
        // NOT NEEDED, IT'S ALREADY CONSIDERED IN --override :
        // cmd += ' -c codecept.json'; // load configuration file
        // Directory
        if (!!options.dirScript && !options.file) {
            cmd += ` ${options.dirScript}`;
        }
        // Parameters
        // if ( !! options.parameters ) {
        //     cmd += ` ${options.parameters}`;
        // }
        // Grep
        if (!!options.grep) {
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
        if (!!options.file ||
            !!options.dirResult ||
            inParallel ||
            !!options.target ||
            !!options.headless) {
            // const overridePieces: string[] = [];
            // let overrideObj = {};
            let overrideObj = Object.assign(this._defaultFrameworkConfig || {}, {});
            // console.log( 'BEFORE', overrideObj );
            if (!!options.file) {
                if (!options.dirScript) {
                    const files = options.file.split(',');
                    const globPattern = files.length > 1
                        ? `{${options.file}}`
                        : options.file;
                    // overridePieces.push( `\\\\"tests\\\\":\\\\"${globPattern}\\\\"` );
                    overrideObj["tests"] = globPattern;
                }
                else if (!options.grep) {
                    const toUnixPath = path => path.replace(/\\\\?/g, '/');
                    const files = (options.file + '')
                        .split(',')
                        // Make paths using the source code dir
                        // .map( f => toUnixPath( resolve( options.dirScripts, f ) ) );
                        .map(f => path_1.isAbsolute(f) ? f : toUnixPath(path_1.join(options.dirScript, f)));
                    const fileNamesSeparatedByComma = files.length > 1 ? files.join(',') : files[0];
                    // const globPattern = `${options.dirScripts}/**/*/{${fileNamesSeparatedByComma}}.js`;
                    const globPattern = files.length > 1
                        ? `{${fileNamesSeparatedByComma}}`
                        : fileNamesSeparatedByComma;
                    // overridePieces.push( `\\\\"tests\\\\":\\\\"${globPattern}\\\\"` );
                    overrideObj["tests"] = globPattern;
                }
            }
            if (!!options.dirResult) {
                // overridePieces.push( `\\\\"output\\\\":\\\\"${options.dirResults}\\\\"` );
                overrideObj["output"] = options.dirResult;
            }
            if (inParallel) {
                // const multiple = browsers
                //     ? `\\\\"multiple\\\\":{\\\\"parallel\\\\":{\\\\"chunks\\\\":${options.instances},${browsers}}}`
                //     : `\\\\"multiple\\\\":{\\\\"parallel\\\\":{\\\\"chunks\\\\":${options.instances}}}`;
                // overridePieces.push( multiple );
                overrideObj["multiple"] = {
                    "parallel": {
                        "chunks": options.instances,
                        "browsers": options.target ? options.target.split(',').map(b => b.trim()) : undefined
                    }
                };
                // } else if ( browsers ) {
                //     overridePieces.push( browsers );
                // }
            }
            else if (options.target) {
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
                if (overrideObj['helpers'] && overrideObj['helpers']['WebDriverIO']) {
                    const browsersArray = options.target.split(',').map(b => b.trim());
                    const wdio = overrideObj['helpers']['WebDriverIO'];
                    if (1 === browsersArray.length) {
                        wdio['browser'] = browsersArray[0];
                    }
                    else {
                        const multiremoteCfg = {};
                        for (const browser of browsersArray) {
                            multiremoteCfg[browser] = {
                                "desiredCapabilities": {
                                    "browserName": browser
                                }
                            };
                        }
                        wdio['multiremote'] = multiremoteCfg;
                    }
                }
            }
            if (options.headless && overrideObj['helpers'] && overrideObj['helpers']['WebDriverIO']) {
                const wdio = overrideObj['helpers']['WebDriverIO'];
                wdio['desiredCapabilities'] = wdio['desiredCapabilities'] || {};
                const cap = wdio['desiredCapabilities'];
                if ('chrome' === wdio['browser']) {
                    cap['browserName'] = 'chrome';
                    cap['chromeOptions'] = {
                        "args": [
                            "--headless",
                            "--disable-gpu",
                            "--no-sandbox",
                            "--proxy-server='direct://'",
                            "--proxy-bypass-list=*"
                        ]
                    };
                }
                else if ('firefox' === wdio['browser']) {
                    cap['browserName'] = 'firefox';
                    cap['moz:firefoxOptions'] = {
                        "args": [
                            "-headless"
                        ]
                    };
                }
            }
            // console.log( 'AFTER', overrideObj );
            // cmd += ' --override "{' + overridePieces.join( ',' ) + '}"';
            const jsonOverrideObj = JSON.stringify(overrideObj, undefined, '');
            const isEmptyObject = '{}' === jsonOverrideObj;
            if (!isEmptyObject) {
                const jsonConfig = JSON.stringify(this._defaultFrameworkConfig, undefined, '');
                if (jsonOverrideObj !== jsonConfig) {
                    const overrideStr = jsonOverrideObj.replace(/"/g, '\\\\\\\"');
                    //
                    // CodeceptJS has a bug in which it does not accept a JSON
                    // with one or more spaces. Thus, as a workaround, we can
                    // create a copy the original configuration file, overwrite the
                    // original with the desired configuration, then restore it.
                    //
                    if (overrideStr.indexOf(' ') < 0) {
                        cmd += ` --override "${overrideStr}"`;
                    }
                    else {
                        backupFile = true;
                        obj = overrideObj;
                    }
                }
            }
        }
        cmd += ' --steps';
        const outputDir = options.dirResult || 'output';
        let reporter = 'mocha-multi';
        // let reporter = 'mochawesome';
        if ('mocha-multi' === reporter) {
            // cmd += ` --reporter mocha-multi --reporter-options json=${outputDir}/output.json,doc=${outputDir}/output.html`;
            cmd += ` --reporter mocha-multi`;
        }
        else { // if ( 'mochawesome' === reporter ) {
            cmd += ` --reporter mochawesome --reporter-options reportDir=${outputDir},reportFilename=output.json`;
        }
        cmd += inParallel ? ' || echo .' : ' --colors || echo .';
        return [cmd, backupFile, obj];
    }
}
exports.CliCommandMaker = CliCommandMaker;
