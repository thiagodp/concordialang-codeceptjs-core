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
    makeCommand(options: TestScriptExecutionOptions): string;
    private fileExists;
    assureConfigurationFile(executionPath: string): Promise<boolean>;
    private runCommand;
}
