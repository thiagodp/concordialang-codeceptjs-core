import * as chalk from 'chalk';
import { AbstractTestScript, ATSCommand } from 'concordialang-plugin';
import * as logSymbols from 'log-symbols';
import { render } from "mustache";
import { relative } from 'path';
import { CommandMapper } from "./CommandMapper";
const dedent = require('dedent-js');

/**
 * Generate test scripts for CodeceptJS.
 *
 * Uses [Mustache](https://github.com/janl/mustache.js/) for this purpose.
 */
export class TestScriptGenerator {

    private template: string;

    constructor(
        private _mapper: CommandMapper,
        private _specificationDir?: string
    ) {
        this.template =
        dedent
        `// Generated with ❤ by Concordia
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

    public generate( ats: AbstractTestScript ): string {

        // console.log( 'FROM', ats.sourceFile );

        let obj: any = { ... ats }; // spread to do a deep clone

        for ( let test of obj.testcases || [] ) {
            test.convertedCommands = [];
            for ( let cmd of test.commands || [] ) {
                let converted: string[] = this.analyzeConverted( this._mapper.map( cmd ), cmd, ats );
                test.convertedCommands.push.apply( test.convertedCommands, converted );
            }
        }

		// Events supported by CodeceptJS (beforeAll and afterAll are not supported)
        const events = [ 'beforeFeature', 'afterFeature', 'beforeEachScenario', 'afterEachScenario' ];
        for ( let eventStr of events ) {
            let event = obj[ eventStr ];
            if ( ! event ) { // Not found in the supported ones
                continue;
            }
            event.convertedCommands = [];
            for ( let cmd of event.commands || [] ) {
                let converted: string[] = this.analyzeConverted( this._mapper.map( cmd ), cmd, ats );
                event.convertedCommands.push.apply( event.convertedCommands, converted );
            }
        }

        return render( this.template, obj ); // mustache's renderer
    }

    analyzeConverted( converted: string[], cmd: ATSCommand, ats: AbstractTestScript ): string[] {
        if ( 0 === converted.length ) {

            const filePath = this._specificationDir
                ? relative( this._specificationDir, ats.sourceFile )
                : ats.sourceFile;

            console.log( logSymbols.warning,
                'Plug-in could not convert command from',
                chalk.yellowBright( filePath ),
                '(' + cmd.location.line + ',' + cmd.location.column + ')'
            );
            return [ this._mapper.makeCommentWithCommand( cmd ) ];
        }
        return converted;
    };


}
