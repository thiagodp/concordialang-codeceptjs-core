"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigMaker = void 0;
const path_1 = require("path");
const toUnixPath = (path) => {
    return path.replace(/\\/g, '/');
};
/**
 * Configuration maker
 */
class ConfigMaker {
    /**
     * Make a basic CodeceptJS configuration.
     *
     * @param filter Filter for test files.
     * @param output Output folder. Default is "./output".
     * @param outputFile Output report file. Default is 'output.json'.
     */
    makeBasicConfig(filter = 'test/**/*.js', output = './output', outputFile = 'output.json') {
        const testsFilter = toUnixPath(path_1.relative(process.cwd(), filter));
        const outputDir = toUnixPath(path_1.relative(process.cwd(), output));
        return {
            "tests": testsFilter,
            "output": outputDir,
            "helpers": {},
            "bootstrap": false,
            "mocha": {
                "reporterOptions": {
                    "codeceptjs-cli-reporter": {
                        "stdout": "-",
                        "options": {
                            "steps": true
                        }
                    },
                    "json": {
                        "stdout": path_1.join(outputDir, outputFile)
                    },
                    "mochawesome": {
                        "stdout": "-",
                        "options": {
                            "reportDir": outputDir,
                            "reportFilename": "report",
                            "uniqueScreenshotNames": true,
                            "timestamp": false
                        }
                    },
                }
            },
            /**
             * Não afeta execução normal, mas só se rodar com
             * `codeceptjs run-parallel parallel`
             *
             * @see TestScriptExecutor
             */
            "multiple": {
                "parallel": {
                    "chunks": 2
                }
            }
        };
    }
    hasHelper(config, hc) {
        const helpers = this.ensureHelpersProperty(config);
        const name = hc.name();
        return !!helpers[name];
    }
    setHelper(config, hc, execOptions) {
        const helpers = this.ensureHelpersProperty(config);
        const name = hc.name();
        helpers[name] = hc.generate(execOptions);
    }
    /**
     * Ensure that the given configurations have a helpers property.
     *
     * @param config Target configuration.
     *
     * @returns A reference to the helpers property.
     */
    ensureHelpersProperty(config) {
        if (!config.helpers) {
            config.helpers = {};
        }
        return config.helpers;
    }
    /**
     * Returns true whether the given configuration has a helpers property.
     *
     * @param config Target configuration
     */
    hasHelpersProperty(config) {
        return !config.helpers ? false : true;
    }
}
exports.ConfigMaker = ConfigMaker;
