import { AbstractTestScript, ATSCommand } from 'concordialang-plugin';
import { CommandMapper } from "./CommandMapper";
/**
 * Generate test scripts for CodeceptJS.
 *
 * Uses [Mustache](https://github.com/janl/mustache.js/) for this purpose.
 */
export declare class TestScriptGenerator {
    private _mapper;
    private _specificationDir?;
    private template;
    constructor(_mapper: CommandMapper, _specificationDir?: string);
    generate(ats: AbstractTestScript): string;
    analyzeConverted(converted: string[], cmd: ATSCommand, ats: AbstractTestScript): string[];
}
