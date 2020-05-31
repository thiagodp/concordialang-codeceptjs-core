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
    protected updateConfiguration(config: any, options: TestScriptExecutionOptions): boolean;
    protected writeConfigurationFile(codeceptJSConfigFile: string, config: any, isUpdate: boolean): Promise<boolean>;
    protected readConfigurationFile(codeceptJSConfigFile: string): Promise<any>;
    protected fileExists(path: string): Promise<boolean>;
    protected writeObjectToFile(path: string, obj: object): Promise<void>;
    protected copyFile(from: string, to: string): Promise<void>;
    protected deleteFile(path: string): Promise<void>;
    protected runCommand(command: string): Promise<number>;
}
