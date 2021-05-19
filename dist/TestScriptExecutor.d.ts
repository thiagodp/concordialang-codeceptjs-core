import { TestScriptExecutionOptions } from 'concordialang-plugin';
import { HelperConfiguration } from './HelperConfiguration';
/**
 * Executes test scripts using CodeceptJS.
 */
export declare class TestScriptExecutor {
    private readonly _additionalHelpers;
    constructor(_additionalHelpers?: Array<HelperConfiguration>);
    /**
     * Executes the script according to the options given.
     *
     * @param options Execution options
     */
    execute(options: TestScriptExecutionOptions): Promise<string>;
    protected createBasicConfiguration(options: TestScriptExecutionOptions): any;
    protected addHelpers(config: any, options: TestScriptExecutionOptions): boolean;
    protected writeJsonConfigurationFile(jsonFileName: string, config: any, isUpdate: boolean): Promise<boolean>;
}
