"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CmdHelperConfiguration {
    constructor(requireFile = './node_modules/codeceptjs-cmdhelper') {
        this.requireFile = requireFile;
    }
    /** @inheritdoc */
    name() {
        return 'CmdHelper';
    }
    /** @inheritdoc */
    generate(execOptions) {
        return {
            "require": this.requireFile
        };
    }
}
exports.CmdHelperConfiguration = CmdHelperConfiguration;
