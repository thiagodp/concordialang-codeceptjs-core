import { TestScriptExecutionOptions } from 'concordialang-plugin';

export interface HelperConfiguration {

    /**
     * Returns the helper name.
     */
    name(): string;

    /**
     * Generate a helper configuration.
     *
     * @param execOptions Execution options.
     * @returns the added configuration.
     */
    generate( execOptions: TestScriptExecutionOptions ): any;

}
