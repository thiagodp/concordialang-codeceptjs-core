"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestScriptGenerator = void 0;
const chalk = require("chalk");
const logSymbols = require("log-symbols");
const mustache_1 = require("mustache");
const path_1 = require("path");
const dedent = require('dedent-js');
/**
 * Generate test scripts for CodeceptJS.
 *
 * Uses [Mustache](https://github.com/janl/mustache.js/) for this purpose.
 */
class TestScriptGenerator {
    constructor(_mapper, _specificationDir) {
        this._mapper = _mapper;
        this._specificationDir = _specificationDir;
        this.template =
            dedent `// Generated with ❤ by Concordia
        // source: {{{sourceFile}}}
        //
        // THIS IS A GENERATED FILE - MODIFICATIONS CAN BE LOST !

        Feature("{{feature.name}}");
        {{#beforeFeature}}

        BeforeSuite( async (I) => { // Before Feature
            {{#convertedCommands}}
            {{{.}}}
            {{/convertedCommands}}
        });
        {{/beforeFeature}}
        {{#afterFeature}}

        AfterSuite( async (I) => { // After Feature
            {{#convertedCommands}}
            {{{.}}}
            {{/convertedCommands}}
        });
        {{/afterFeature}}
        {{#beforeEachScenario}}

        Before( async (I) => { // Before Each Scenario
            {{#convertedCommands}}
            {{{.}}}
            {{/convertedCommands}}
        });
        {{/beforeEachScenario}}
        {{#afterEachScenario}}

        After( async (I) => { // After Each Scenario
            {{#convertedCommands}}
            {{{.}}}
            {{/convertedCommands}}
        });
        {{/afterEachScenario}}

        {{#testcases}}
        Scenario("{{scenario}} | {{name}}", (I) => {
            {{#convertedCommands}}
            {{{.}}}
            {{/convertedCommands}}
        });

        {{/testcases}}`;
    }
    generate(ats) {
        // console.log( 'FROM', ats.sourceFile );
        let obj = Object.assign({}, ats); // spread to do a deep clone
        for (let test of (obj.testcases || [])) {
            test.convertedCommands = [];
            for (let cmd of (test.commands || [])) {
                let converted = this.analyzeConverted(this._mapper.map(cmd), cmd, ats);
                test.convertedCommands.push.apply(test.convertedCommands, converted);
            }
        }
        // Events supported by CodeceptJS (beforeAll and afterAll are not supported)
        const events = ['beforeFeature', 'afterFeature', 'beforeEachScenario', 'afterEachScenario'];
        for (let eventStr of events) {
            let event = obj[eventStr];
            if (!event) { // Not found in the supported ones
                continue;
            }
            event.convertedCommands = [];
            for (let cmd of (event.commands || [])) {
                let converted = this.analyzeConverted(this._mapper.map(cmd), cmd, ats);
                event.convertedCommands.push.apply(event.convertedCommands, converted);
            }
        }
        return mustache_1.render(this.template, obj); // mustache's renderer
    }
    analyzeConverted(converted, cmd, ats) {
        if (converted && 0 === converted.length && ats && cmd) {
            const filePath = this._specificationDir
                ? path_1.relative(this._specificationDir, ats.sourceFile)
                : ats.sourceFile;
            console.log(logSymbols.warning, 'Plug-in could not convert command from', chalk.yellowBright(filePath), cmd.location ? '(' + cmd.location.line + ',' + cmd.location.column + ')' : '');
            return [this._mapper.makeCommentWithCommand(cmd)];
        }
        return converted || [];
    }
    ;
}
exports.TestScriptGenerator = TestScriptGenerator;
