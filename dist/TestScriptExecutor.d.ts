import { TestScriptExecutionOptions } from 'concordialang-plugin';
/**
 * Executes test scripts using CodeceptJS.
 */
export declare class TestScriptExecutor {
    private readonly _defaultFrameworkConfig;
    constructor(_defaultFrameworkConfig: object);
    /**
     * Executes the script according to the options given.
     *
     * @param options Execution options
     */
    execute(options: TestScriptExecutionOptions): Promise<string>;
    makeCmd(options: TestScriptExecutionOptions): string;
    makeCommand(options: TestScriptExecutionOptions): [string, boolean, object];
    assureConfigurationFile(codeceptJSConfigFile: string): Promise<boolean>;
    private fileExists;
    private writeObjectToFile;
    private copyFile;
    private deleteFile;
    private runCommand;
}
