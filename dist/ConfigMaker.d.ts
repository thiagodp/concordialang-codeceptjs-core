import { HelperConfiguration } from './HelperConfiguration';
import { TestScriptExecutionOptions } from 'concordialang-plugin/dist';
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
    hasHelper(config: any, hc: HelperConfiguration): boolean;
    setHelper(config: any, hc: HelperConfiguration, execOptions: TestScriptExecutionOptions): void;
    /**
     * Ensure that the given configurations have a helpers property.
     *
     * @param config Target configuration.
     *
     * @returns A reference to the helpers property.
     */
    protected ensureHelpersProperty(config: any): any;
    /**
     * Returns true whether the given configuration has a helpers property.
     *
     * @param config Target configuration
     */
    hasHelpersProperty(config: any): boolean;
}
