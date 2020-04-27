"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const childProcess = require("child_process");
const figures_1 = require("figures");
const fs_1 = require("fs");
const fse = require("node-fs-extra");
const path_1 = require("path");
const util_1 = require("util");
const ConfigMaker_1 = require("./ConfigMaker");
// UI ----------------------------------
const iconInfo = chalk.blueBright(figures_1.info);
const iconWarning = chalk.yellow(figures_1.warning);
const iconError = chalk.redBright(figures_1.cross);
const textColor = chalk.cyanBright;
const textCommand = chalk.cyan;
const highlight = chalk.yellowBright;
const writeln = (...args) => {
    console.log(...args);
};
const showInfo = (title, content, addition) => {
    if (content) {
        writeln(iconInfo, textColor(title), highlight(content) + (addition ? textColor(addition) : ''));
    }
    else {
        writeln(iconInfo, textColor(title));
    }
};
// -------------------------------------
/**
 * Executes test scripts using CodeceptJS.
 */
class TestScriptExecutor {
    constructor(_defaultFrameworkConfig) {
        this._defaultFrameworkConfig = _defaultFrameworkConfig;
    }
    /**
     * Executes the script according to the options given.
     *
     * @param options Execution options
     */
    execute(options) {
        return __awaiter(this, void 0, void 0, function* () {
            // Creates the source code dir if it does not exist
            if (!!options.dirScript) {
                showInfo('Test scripts in', options.dirScript);
                yield fse.mkdirs(options.dirScript);
            }
            // Creates the execution result/output dir if it does not exist
            if (!!options.dirResult) {
                showInfo('Results in', options.dirResult);
                yield fse.mkdirs(options.dirResult);
            }
            const executionPath = process.cwd();
            // codecept.json -------------------------------------------------------
            const codeceptJSConfigFile = path_1.join(executionPath, 'codecept.json');
            const isConfigFileAssured = yield this.assureConfigurationFile(codeceptJSConfigFile);
            // Run CodeceptJS ------------------------------------------------------
            const [cmd, needsToCreateBackup, tempConfig] = this.makeCommand(options);
            // Preparing backup file if needed
            //
            //      CodeceptJS' parameter --override has a bug in which it does not
            //      accept a JSON content with one or more spaces. As a workaround,
            //      we are creating a backup copy of the original configuration file
            //      and restoring it after executing the test scripts.
            //
            const backupFile = 'codecept-backup-' + Date.now() + '.json';
            let backupFileCreated = false;
            if (isConfigFileAssured && needsToCreateBackup) {
                try {
                    // Create a backup copy
                    yield this.copyFile(codeceptJSConfigFile, backupFile);
                    // Overwrite current configuration file
                    yield this.writeObjectToFile(codeceptJSConfigFile, tempConfig);
                    // Indicate success
                    backupFileCreated = true;
                }
                catch (e) {
                    writeln(iconError, textColor('Error copying the configuration file'), highlight(codeceptJSConfigFile));
                }
            }
            // Running the test scripts
            showInfo('Running test scripts...');
            writeln(' ', textCommand(cmd));
            const code = yield this.runCommand(cmd);
            // Restoring the backup if needed
            if (backupFileCreated) {
                try {
                    // Copy the backup file back
                    yield this.copyFile(backupFile, codeceptJSConfigFile);
                    // Delete the backup file
                    yield this.deleteFile(backupFile);
                }
                catch (e) {
                    writeln(iconError, textColor('Error restoring the backup file'), highlight(backupFile));
                }
            }
            // Output file ---------------------------------------------------------
            const OUTPUT_FILE_NAME = 'output.json';
            const outputFilePath = path_1.join(options.dirResult || '.', OUTPUT_FILE_NAME);
            showInfo('Retrieving results from', outputFilePath, '...');
            return outputFilePath;
        });
    }
    makeCmd(options) {
        const [cmd] = this.makeCommand(options);
        return cmd;
    }
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
            const isEmptyObject = '{}' === JSON.stringify(overrideObj);
            if (!isEmptyObject) {
                const overrideStr = JSON.stringify(overrideObj, undefined, '')
                    .replace(/"/g, '\\\\\\\"');
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
    assureConfigurationFile(codeceptJSConfigFile) {
        return __awaiter(this, void 0, void 0, function* () {
            // const writeF = promisify( writeFile );
            const configFileExists = yield this.fileExists(codeceptJSConfigFile);
            // It's only possible to run CodeceptJS if there is a config file
            if (!configFileExists) {
                try {
                    // const json = JSON.stringify( this._defaultFrameworkConfig, undefined, "\t" );
                    // await writeF( codeceptJSConfigFile, json );
                    yield this.writeObjectToFile(codeceptJSConfigFile, this._defaultFrameworkConfig);
                }
                catch (e) {
                    writeln(iconError, textColor('Could not generate'), highlight(codeceptJSConfigFile) + '.', textColor('Please run the following command:'));
                    writeln(textColor('  codeceptjs init'));
                    return false;
                }
                showInfo('Generated configuration file', codeceptJSConfigFile);
                writeln(figures_1.arrowRight, textColor('If this file does not work for you, delete it and then run:'));
                writeln(textColor('  codeceptjs init'));
            }
            else { // exists
                // Let's check needed dependencies
                let config = {};
                try {
                    const readF = util_1.promisify(fs_1.readFile);
                    const content = yield readF(codeceptJSConfigFile);
                    config = JSON.parse(content.toString());
                    showInfo('Configuration file', codeceptJSConfigFile);
                }
                catch (e) {
                    writeln(iconError, textColor('Could not read'), highlight(codeceptJSConfigFile));
                    return false;
                }
                const cfgMaker = new ConfigMaker_1.ConfigMaker();
                let needsToWriteConfig = !cfgMaker.hasHelpersProperty(config);
                if (!cfgMaker.hasCmdHelper(config)) {
                    cfgMaker.setCmdHelper(config);
                    needsToWriteConfig = true;
                }
                if (!cfgMaker.hasDbHelper(config)) {
                    cfgMaker.setDbHelper(config);
                    needsToWriteConfig = true;
                }
                if (needsToWriteConfig) {
                    try {
                        // await writeF( codeceptJSConfigFile, JSON.stringify( config ) );
                        yield this.writeObjectToFile(codeceptJSConfigFile, config);
                        showInfo('Updated configuration file', codeceptJSConfigFile);
                    }
                    catch (e) {
                        writeln(iconError, textColor('Error updating configuration file'), highlight(codeceptJSConfigFile) + '. Please check if it has DbHelper and CmdHelper configured.');
                        return false;
                    }
                }
            }
            return true;
        });
    }
    fileExists(path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessFile = util_1.promisify(fs_1.access);
                yield accessFile(path, fs_1.constants.F_OK);
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
    writeObjectToFile(path, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const writeF = util_1.promisify(fs_1.writeFile);
            const json = JSON.stringify(obj, undefined, "\t");
            yield writeF(path, json);
        });
    }
    copyFile(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            const readF = util_1.promisify(fs_1.readFile);
            const writeF = util_1.promisify(fs_1.writeFile);
            const content = yield readF(from, { encoding: 'utf8' });
            yield writeF(to, content, { encoding: 'utf8', flag: 'w+' });
        });
    }
    deleteFile(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const unlinkF = util_1.promisify(fs_1.unlink);
            yield unlinkF(path);
        });
    }
    // private escapeJson( json: string ): string {
    //     return JSON.stringify( { _: json} ).slice( 6, -2 );
    // }
    runCommand(command) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                // stdio: 'inherit', // <<< not working on windows!
                shell: true
            };
            // Splits the command into pieces to pass to the process;
            //  mapping function simply removes quotes from each piece
            let cmds = command.match(/[^"\s]+|"(?:\\\\"|[^"])+"/g)
                .map(expr => {
                return expr.charAt(0) === '"' && expr.charAt(expr.length - 1) === '"' ? expr.slice(1, -1) : expr;
            });
            const runCMD = cmds[0];
            cmds.shift();
            return new Promise((resolve, reject) => {
                const child = childProcess.spawn(runCMD, cmds, options);
                child.stdout.on('data', (chunk) => {
                    console.log(chunk.toString());
                });
                child.stderr.on('data', (chunk) => {
                    console.warn(chunk.toString());
                });
                child.on('exit', (code) => {
                    resolve(code);
                });
            });
        });
    }
}
exports.TestScriptExecutor = TestScriptExecutor;
