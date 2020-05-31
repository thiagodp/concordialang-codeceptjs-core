import { TestScriptExecutionOptions } from "concordialang-plugin";
import { HelperConfiguration } from "./HelperConfiguration";

export class DbHelperConfiguration implements HelperConfiguration {

    constructor(
        private readonly requireFile: string = './node_modules/codeceptjs-dbhelper'
     ) {
    }

    /** @inheritdoc */
    name() {
        return 'DbHelper';
    }

    /** @inheritdoc */
    generate( execOptions: TestScriptExecutionOptions ): any {
        return {
            "require": this.requireFile
        };
    }

}