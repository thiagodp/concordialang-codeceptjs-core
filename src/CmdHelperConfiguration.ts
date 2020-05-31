import { TestScriptExecutionOptions } from "concordialang-plugin";
import { HelperConfiguration } from "./HelperConfiguration";

export class CmdHelperConfiguration implements HelperConfiguration {

    constructor(
        private readonly requireFile: string = './node_modules/codeceptjs-cmdhelper'
     ) {
    }

    /** @inheritdoc */
    name() {
        return 'CmdHelper';
    }

    /** @inheritdoc */
    generate( execOptions: TestScriptExecutionOptions ): any {
        return {
            "require": this.requireFile
        };
    }

}