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
exports.TestScriptExecutor = void 0;
const chalk = require("chalk");
const figures_1 = require("figures");
const fs_1 = require("fs");
const fse = require("node-fs-extra");
const path_1 = require("path");
const util_1 = require("util");
const cjs_1 = require("./cjs");
const CmdHelperConfiguration_1 = require("./CmdHelperConfiguration");
const ConfigMaker_1 = require("./ConfigMaker");
const DbHelperConfiguration_1 = require("./DbHelperConfiguration");
const wildcard_1 = require("./wildcard");
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
            //
            // Load configuration file
            //
            let configFile;
            const jsonConfigFile = (0, path_1.join)(executionPath, 'codecept.json');
            const jsConfigFile = './codecept.conf.js';
            const readF = (0, util_1.promisify)(fs_1.readFile);
            let cfgFileType = 'none';
            let cfg;
            // Read JSON config file
            try {
                const jsonContent = yield readF(jsonConfigFile, { encoding: 'UTF-8' });
                cfg = JSON.parse(jsonContent.toString());
                cfgFileType = 'json';
                configFile = jsonConfigFile;
            }
            catch (_a) {
                // ignore - JSON config file not found
            }
            // Read JS config file if the JSON file was not found
            if (!cfg) {
                try {
                    const jsContent = yield require(jsConfigFile);
                    cfg = jsContent.config;
                    cfgFileType = 'js';
                    configFile = jsConfigFile;
                }
                catch (_b) {
                    // ignore - JS config file not found
                }
            }
            // Create a basic JSON configuration file if none exists
            if (!cfg) {
                writeln(iconWarning, textColor('No CodeceptJS configuration file was found (codecept.json or codecept.conf.js).'));
                writeln(iconInfo, textColor('Creating'), highlight(jsonConfigFile), textColor('for you...'));
                cfg = this.createBasicConfiguration(options);
                // Add Helpers
                this.addHelpers(cfg, options);
                yield this.writeJsonConfigurationFile(jsonConfigFile, cfg, false);
                // Add helpers
            }
            else {
                showInfo('Configuration file', configFile || 'not found');
                const changed = this.addHelpers(cfg, options); // Add Helpers
                // Rewrite the JSON configuration file if needed
                // TO-DO: Allow to update a JS config file
                if (changed && 'json' == cfgFileType) {
                    yield this.writeJsonConfigurationFile(jsonConfigFile, cfg, true);
                }
            }
            //
            // Adjust configuration from Concordia parameters
            //
            const isInParallel = options.instances && options.instances > 1;
            let configuredBrowsers = [];
            if (options.target) {
                configuredBrowsers = options.target.split(',').map(b => b.trim());
            }
            else {
                // Collect browser from helpers
                if (cfg['helpers']) {
                    for (const [, v] of Object.entries(cfg['helpers'])) {
                        const o = v;
                        const browser = o['browser'];
                        if (browser && !configuredBrowsers.includes(browser)) {
                            configuredBrowsers.push(browser);
                        }
                    }
                }
            }
            if (isInParallel) {
                // Include browsers for parallel if not defined. That's not depend on the parallel flag !
                if (configuredBrowsers.length > 0) {
                    cfg['multiple'] = {
                        "parallel": {
                            "chunks": options.instances,
                            "browsers": configuredBrowsers,
                        }
                    };
                }
            }
            else { // Not in parallel
                // Change the helpers to use the target browser when
                // a target browser is defined and it is not parallel execution.
                if (cfg['helpers'] && (options.target || true === options.headless)) {
                    const [firstTargetBrowser] = configuredBrowsers;
                    for (const [, v] of Object.entries(cfg['helpers'])) {
                        const o = v;
                        if (options.target && o['browser']) {
                            o['browser'] = firstTargetBrowser;
                        }
                        if (true === options.headless && o['show']) {
                            o['show'] = false;
                        }
                    }
                }
            }
            // Define (result) output directory if defined
            if (!!options.dirResult) {
                cfg['output'] = options.dirResult;
            }
            // Define wildcard to JS files if not file is detected
            if (!options.file || '' === options.file.toString().trim()) {
                cfg['tests'] = (0, wildcard_1.addJSWildcard)(options.dirScript);
                // Create glob for file name
            }
            else {
                if (!options.dirScript) { // No directory -> use glob for a single or multiple files
                    const files = options.file.split(',');
                    const globPattern = files.length > 1 ? `{${options.file}}` : options.file;
                    cfg['tests'] = globPattern;
                }
                else if (!options.grep) { // No grep -> separate files, add full path, and make glob
                    const toUnixPath = path => path.replace(/\\\\?/g, '/');
                    const files = (options.file + '')
                        .split(',')
                        // Make paths using the source code dir
                        // .map( f => toUnixPath( resolve( options.dirScripts, f ) ) );
                        .map(f => (0, path_1.isAbsolute)(f) ? f : toUnixPath((0, path_1.join)(options.dirScript, f)));
                    const fileNamesSeparatedByComma = files.length > 1 ? files.join(',') : files[0];
                    const globPattern = files.length > 1
                        ? `{${fileNamesSeparatedByComma}}`
                        : fileNamesSeparatedByComma;
                    cfg['tests'] = globPattern;
                }
            }
            // Playwright - Fix browser from 'chrome' to 'chromium' whether defined
            if ('chrome' === options.target && cfg['helpers'] && cfg['helpers']['Playwright']) {
                options.target = 'chromium';
                writeln(iconWarning, 'Playwright does not support "chrome" but "chromium". Please fix it to remove this warning. Using "chromium".');
            }
            // WebDriverIO - experimental "multiremote" configuration for multiple browsers.
            // @see https://codecept.io/helpers/WebDriver/#multiremote-capabilities
            // @see http://webdriver.io/guide/usage/multiremote.html
            if (options.target && cfg['helpers'] && cfg['helpers']['WebDriverIO']) {
                const browsersArray = options.target.split(',').map(b => b.trim());
                const wdio = cfg['helpers']['WebDriverIO'];
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
            // WebDriverIO - Headless mode changes
            if (options.headless && cfg['helpers'] && cfg['helpers']['WebDriverIO']) {
                const wdio = cfg['helpers']['WebDriverIO'];
                wdio['desiredCapabilities'] = wdio['desiredCapabilities'] || {};
                const dc = wdio['desiredCapabilities'];
                if ('chrome' === wdio['browser']) {
                    dc['browserName'] = 'chrome';
                    dc['chromeOptions'] = {
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
                    dc['browserName'] = 'firefox';
                    dc['moz:firefoxOptions'] = {
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
                gherkin: {},
                plugins: {
                    screenshotOnFail: {
                        enabled: true, // will be disabled by default in 2.0
                    },
                },
                // OTHER OPTIONS:
                require: undefined,
                noGlobals: undefined,
                tests: undefined, // string
            };
            const defaultCliOptions = {
                profile: undefined,
                features: undefined,
                tests: undefined,
                override: undefined,
                // mocha opts
                grep: undefined,
                reporter: undefined,
                reporterOptions: undefined, // string
            };
            // Mocha Awesome reports
            // https://codecept.io/reports/#html
            let mocha = cfg['mocha'];
            if (!mocha) {
                mocha = cfg['mocha'] = {};
            }
            let reporterOptions = mocha['reporterOptions'];
            if (!reporterOptions) {
                reporterOptions = mocha['reporterOptions'] = {};
            }
            if (!reporterOptions['reportDir']) {
                reporterOptions['reportDir'] = options.dirResult;
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
            const finalCodeceptConfig = Object.assign(Object.assign({}, defaultConfig), cfg);
            const finalCliOptions = Object.assign(Object.assign({}, defaultCliOptions), overrideCliOptions);
            // console.log( finalCodeceptConfig );
            //
            // Execution
            //
            const codecept = new cjs_1.Codecept(finalCodeceptConfig, finalCliOptions);
            let error = false;
            try {
                codecept.init(executionPath);
                yield codecept.bootstrap();
                codecept.loadTests();
                yield codecept.run();
            }
            catch (err) {
                error = true;
                const e = err;
                writeln(iconError, e.message ? e.message : err);
            }
            finally {
                yield codecept.teardown();
            }
            //
            // Output file
            //
            return error ? '' : (0, path_1.join)(options.dirResult || '.', 'output.json');
        });
    }
    createBasicConfiguration(options) {
        const scriptFileFilter = (0, wildcard_1.addJSWildcard)(options.dirScript);
        const cfgMaker = new ConfigMaker_1.ConfigMaker();
        const config = cfgMaker.makeBasicConfig(scriptFileFilter, options.dirResult);
        return config;
    }
    addHelpers(config, options) {
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
    writeJsonConfigurationFile(jsonFileName, config, isUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            const writeF = (0, util_1.promisify)(fs_1.writeFile);
            try {
                const json = JSON.stringify(config, undefined, "\t");
                yield writeF(jsonFileName, json);
            }
            catch (e) {
                if (isUpdate) {
                    writeln(iconError, textColor('Error updating configuration file'), highlight(jsonFileName) +
                        '. Please check if DbHelper and CmdHelper helpers are configured in CodeceptJS configuration file.');
                }
                else {
                    writeln(iconError, textColor('Could not generate'), highlight(jsonFileName) + '.', textColor('Please run the following command:'));
                    writeln(textColor('  codeceptjs init'));
                }
                return false;
            }
            if (isUpdate) {
                showInfo('Updated configuration file', jsonFileName);
            }
            else {
                showInfo('Generated configuration file', jsonFileName);
                writeln(figures_1.arrowRight, textColor('If this file does not work for you, delete it and then run:'));
                writeln(textColor('  codeceptjs init'));
            }
            return true;
        });
    }
}
exports.TestScriptExecutor = TestScriptExecutor;
