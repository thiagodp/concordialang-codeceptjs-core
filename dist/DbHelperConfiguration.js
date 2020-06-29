"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbHelperConfiguration = void 0;
class DbHelperConfiguration {
    constructor(requireFile = './node_modules/codeceptjs-dbhelper') {
        this.requireFile = requireFile;
    }
    /** @inheritdoc */
    name() {
        return 'DbHelper';
    }
    /** @inheritdoc */
    generate(execOptions) {
        return {
            "require": this.requireFile
        };
    }
}
exports.DbHelperConfiguration = DbHelperConfiguration;
