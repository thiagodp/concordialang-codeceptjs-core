import { AbstractTestScript, Plugin, TestScriptExecutionOptions, TestScriptExecutionResult, TestScriptGenerationOptions, TestScriptGenerationResult } from 'concordialang-plugin';
import { TestScriptExecutor } from './TestScriptExecutor';
import { TestScriptGenerator } from './TestScriptGenerator';
/**
 * Plugin for CodeceptJS.
 */
export declare abstract class CodeceptJS implements Plugin {
    private _encoding;
    private readonly _descriptorPath;
    private readonly _fs;
    /**
     * Constructor
     *
     * @param descriptorPath Path of the plugin descriptor file.
     * @param fsToUse Filesystem object to use. Default is nodejs fs.
     * @param _encoding Encoding to use. Default is 'utf8'.
     */
    constructor(descriptorPath?: string, fsToUse?: any, _encoding?: string);
    /** @inheritDoc */
    generateCode(abstractTestScripts: AbstractTestScript[], options: TestScriptGenerationOptions): Promise<TestScriptGenerationResult>;
    /** @inheritDoc */
    executeCode(options: TestScriptExecutionOptions): Promise<TestScriptExecutionResult>;
    /** @inheritDoc */
    convertReportFile(filePath: string): Promise<TestScriptExecutionResult>;
    /** @inheritDoc */
    defaultReportFile(): Promise<string>;
    /**
     * Creates a test script file path.
     *
     * @param targetDir Target directory, e.g. `tests`
     * @param specFilePath Specification file, e.g. `path/to/features/sub1/sub2/f1.testcase`
     * @param specDir Specification directory, e.g. `path/to/features/`
     */
    private createFilePath;
    private ensureDir;
    private writeFile;
    protected createTestScriptGenerator(specificationDir?: string): TestScriptGenerator;
    protected createTestScriptExecutor(options: TestScriptExecutionOptions): Promise<TestScriptExecutor>;
}
