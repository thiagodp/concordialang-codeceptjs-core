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
const CliCommandMaker_1 = require("./CliCommandMaker");
const CmdHelperConfiguration_1 = require("./CmdHelperConfiguration");
const ConfigMaker_1 = require("./ConfigMaker");
const DbHelperConfiguration_1 = require("./DbHelperConfiguration");
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
    constructor(_additionalHelpers = []) {
        this._additionalHelpers = _additionalHelpers;
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
            let configFileExists = yield this.fileExists(codeceptJSConfigFile);
            let config;
            // It's only possible to run CodeceptJS if there is a config file
            if (!configFileExists) {
                config = this.createBasicConfiguration(options);
                configFileExists = yield this.writeConfigurationFile(codeceptJSConfigFile, config, false);
            }
            else {
                config = yield this.readConfigurationFile(codeceptJSConfigFile);
                if (!config) {
                    config = this.createBasicConfiguration(options);
                }
            }
            const changed = this.updateConfiguration(config, options);
            if (changed) {
                yield this.writeConfigurationFile(codeceptJSConfigFile, config, true);
            }
            // Run CodeceptJS ------------------------------------------------------
            const commandMaker = new CliCommandMaker_1.CliCommandMaker(config);
            const [cmd, needsToCreateBackup, tempConfig] = commandMaker.makeCommand(options);
            // Preparing backup file if needed
            //
            //      CodeceptJS' parameter --override has a bug in which it does not
            //      accept a JSON content with one or more spaces. As a workaround,
            //      we are creating a backup copy of the original configuration file
            //      and restoring it after executing the test scripts.
            //
            const backupFile = 'codecept-backup-' + Date.now() + '.json';
            let backupFileCreated = false;
            if (configFileExists && needsToCreateBackup) {
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
    createBasicConfiguration(options) {
        const scriptFileFilter = path_1.join(options.dirScript, '**/*.js');
        const cfgMaker = new ConfigMaker_1.ConfigMaker();
        const config = cfgMaker.makeBasicConfig(scriptFileFilter, options.dirResult);
        return config;
    }
    updateConfiguration(config, options) {
        const helpers = [
            new DbHelperConfiguration_1.DbHelperConfiguration(),
            new CmdHelperConfiguration_1.CmdHelperConfiguration(),
            ...(this._additionalHelpers || [])
        ];
        const cfgMaker = new ConfigMaker_1.ConfigMaker();
        let changed = false;
        for (const helper of helpers) {
            if (!cfgMaker.hasHelper(config, helper)) {
                cfgMaker.setHelper(config, helper, options);
                changed = true;
            }
        }
        return changed;
    }
    writeConfigurationFile(codeceptJSConfigFile, config, isUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.writeObjectToFile(codeceptJSConfigFile, config);
            }
            catch (e) {
                if (isUpdate) {
                    writeln(iconError, textColor('Error updating configuration file'), highlight(codeceptJSConfigFile) +
                        '. Please check if it has DbHelper and CmdHelper configured.');
                }
                else {
                    writeln(iconError, textColor('Could not generate'), highlight(codeceptJSConfigFile) + '.', textColor('Please run the following command:'));
                    writeln(textColor('  codeceptjs init'));
                }
                return false;
            }
            if (isUpdate) {
                showInfo('Updated configuration file', codeceptJSConfigFile);
            }
            else {
                showInfo('Generated configuration file', codeceptJSConfigFile);
                writeln(figures_1.arrowRight, textColor('If this file does not work for you, delete it and then run:'));
                writeln(textColor('  codeceptjs init'));
            }
            return true;
        });
    }
    readConfigurationFile(codeceptJSConfigFile) {
        return __awaiter(this, void 0, void 0, function* () {
            let config = null;
            try {
                const readF = util_1.promisify(fs_1.readFile);
                const content = yield readF(codeceptJSConfigFile);
                config = JSON.parse(content.toString());
                showInfo('Configuration file', codeceptJSConfigFile);
            }
            catch (e) {
                writeln(iconError, textColor('Could not read'), highlight(codeceptJSConfigFile));
                return null;
            }
            return config;
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
    // protected escapeJson( json: string ): string {
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
