/**
 * Configuration maker
 */
export declare class ConfigMaker {
    /**
     * Make a basic CodeceptJS configuration.
     *
     * @param filter Filter for test files.
     * @param output Output folder. Default is "./output".
     * @param outputFile Output report file. Default is 'output.json'.
     */
    makeBasicConfig(filter?: string, output?: string, outputFile?: string): {
        tests: string;
        output: string;
        helpers: {};
        bootstrap: boolean;
        mocha: {
            reporterOptions: {
                "codeceptjs-cli-reporter": {
                    stdout: string;
                    options: {
                        steps: boolean;
                    };
                };
                json: {
                    stdout: string;
                };
                mochawesome: {
                    stdout: string;
                    options: {
                        reportDir: string;
                        reportFilename: string;
                        uniqueScreenshotNames: boolean;
                        timestamp: boolean;
                    };
                };
            };
        };
        /**
         * Não afeta execução normal, mas só se rodar com
         * `codeceptjs run-parallel parallel`
         *
         * @see TestScriptExecutor
         */
        multiple: {
            parallel: {
                chunks: number;
            };
        };
    };
    /**
     * Sets a WebDriverIO helper.
     *
     * @param config Target configuration.
     * @param browser Target browser or browsers. Default is "chrome".
     * @param url Application url. Default is "http://localhost".
     */
    setWebDriverIOHelper(config: any, browser?: any, url?: string): void;
    /**
     * Sets a Appium helper.
     *
     * @param config Target configuration.
     * @param platform Platform. Default is "Android".
     * @param app Application url or path. Default is "http://localhost".
     * @param device Device. Default is "emulator".
     */
    setAppiumHelper(config: any, platform?: any, app?: string, device?: string): void;
    /**
     * Sets a DBHelper
     *
     * @param config Target configuration.
     * @param requireFile Required file or library. Defaults to "./node_modules/codeceptjs-dbhelper".
     */
    setDbHelper(config: any, requireFile?: string): void;
    /** Returns the property for DbHelper */
    getDbHelperProperty(): string;
    /**
     * Returns true whether the given configuration has DbHelper.
     *
     * @param config Target configuration
     */
    hasDbHelper(config: any): boolean;
    /**
     * Sets a CmdHelper
     *
     * @param config Target configuration.
     * @param requireFile Required file or library. Defaults to "./node_modules/codeceptjs-cmdhelper".
     */
    setCmdHelper(config: any, requireFile?: string): void;
    /** Returns the property for CmdHelper */
    getCmdHelperProperty(): string;
    /**
     * Returns true whether the given configuration has CmdHelper.
     *
     * @param config Target configuration
     */
    hasCmdHelper(config: any): boolean;
    /**
     * Ensure that the given configurations have a helpers property.
     *
     * @param config Target configuration.
     *
     * @returns A reference to the helpers property.
     */
    ensureHelpersProperty(config: any): any;
    /**
     * Returns true whether the given configuration has a helpers property.
     *
     * @param config Target configuration
     */
    hasHelpersProperty(config: any): boolean;
}
