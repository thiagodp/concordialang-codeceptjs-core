"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmdHelperConfiguration = void 0;
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
