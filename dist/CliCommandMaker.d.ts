import { TestScriptExecutionOptions } from 'concordialang-plugin';
export declare class CliCommandMaker {
    private readonly _defaultFrameworkConfig;
    constructor(_defaultFrameworkConfig: any);
    makeCmd(options: TestScriptExecutionOptions): string;
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
    makeCommand(options: TestScriptExecutionOptions): [string, boolean, object];
}
