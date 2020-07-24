import { TestScriptExecutionOptions } from 'concordialang-plugin';
import { HelperConfiguration } from './HelperConfiguration';
export declare class CmdHelperConfiguration implements HelperConfiguration {
    private readonly requireFile;
    constructor(requireFile?: string);
    /** @inheritdoc */
    name(): string;
    /** @inheritdoc */
    generate(execOptions: TestScriptExecutionOptions): any;
}
