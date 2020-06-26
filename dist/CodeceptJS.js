"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const fse = require("node-fs-extra");
const path_1 = require("path");
const util_1 = require("util");
const CommandMapper_1 = require("./CommandMapper");
const Commands_1 = require("./Commands");
const ReportConverter_1 = require("./ReportConverter");
const TestScriptExecutor_1 = require("./TestScriptExecutor");
const TestScriptGenerator_1 = require("./TestScriptGenerator");
/**
 * Plugin for CodeceptJS.
 */
class CodeceptJS {
    /**
     * Constructor
     *
     * @param descriptorPath Path of the plugin descriptor file.
     * @param fsToUse Filesystem object to use. Default is nodejs fs.
     * @param _encoding Encoding to use. Default is 'utf8'.
     */
    constructor(descriptorPath, fsToUse, _encoding = 'utf8') {
        this._encoding = _encoding;
        this._descriptorPath = descriptorPath || path_1.join(process.cwd(), 'codecept.json');
        this._fs = !fsToUse ? fs : fsToUse;
    }
    /** @inheritDoc */
    generateCode(abstractTestScripts, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = [];
            const scriptGenerator = this.createTestScriptGenerator(options.specificationDir);
            let files = [];
            for (let ats of abstractTestScripts || []) {
                const outputFilePath = this.createFilePath(options.sourceCodeDir, ats.sourceFile, options.specificationDir);
                try {
                    const dir = path_1.dirname(outputFilePath);
                    yield this.ensureDir(dir);
                    // console.log( '> Ensuring dir', dir );
                    // console.log( '> File is', outputFilePath );
                    const code = scriptGenerator.generate(ats);
                    yield this.writeFile(outputFilePath, code);
                    files.push(outputFilePath);
                }
                catch (e) {
                    const msg = 'Error generating script for "' + ats.sourceFile + '": ' + e.message;
                    errors.push(new Error(msg));
                }
            }
            return { generatedFiles: files, errors: errors };
        });
    }
    /** @inheritDoc */
    executeCode(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const scriptExecutor = this.createTestScriptExecutor(options);
            const path = yield scriptExecutor.execute(options);
            return yield this.convertReportFile(path);
        });
    }
    /** @inheritDoc */
    convertReportFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const reportConverter = new ReportConverter_1.ReportConverter(this._fs, this._encoding);
            return yield reportConverter.convertFrom(filePath, this._descriptorPath);
        });
    }
    /** @inheritDoc */
    defaultReportFile() {
        return __awaiter(this, void 0, void 0, function* () {
            return 'output.json';
        });
    }
    /**
     * Creates a test script file path.
     *
     * @param targetDir Target directory, e.g. `tests`
     * @param specFilePath Specification file, e.g. `path/to/features/sub1/sub2/f1.testcase`
     * @param specDir Specification directory, e.g. `path/to/features/`
     */
    createFilePath(targetDir, specFilePath, specDir) {
        const relSpecFilePath = specDir
            ? path_1.relative(specDir, specFilePath)
            : specFilePath;
        const outputDir = specDir
            ? path_1.resolve(targetDir, path_1.dirname(relSpecFilePath))
            : targetDir;
        const fileName = path_1.basename(relSpecFilePath, '.testcase') + '.js';
        return path_1.join(outputDir, fileName);
    }
    ensureDir(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._fs != fs) {
                return;
            }
            // await fse.mkdirs( dir );
            fse.mkdirsSync(dir);
        });
    }
    writeFile(path, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const write = util_1.promisify(this._fs.writeFile || fs.writeFile);
            yield write(path, content, { encoding: this._encoding, flag: 'w+' });
        });
    }
    createTestScriptGenerator(specificationDir) {
        return new TestScriptGenerator_1.TestScriptGenerator(new CommandMapper_1.CommandMapper(Commands_1.CODECEPTJS_COMMANDS), specificationDir);
    }
    createTestScriptExecutor(options) {
        return new TestScriptExecutor_1.TestScriptExecutor();
    }
}
exports.CodeceptJS = CodeceptJS;
