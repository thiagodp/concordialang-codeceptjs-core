import { TestMethodResult, TestScriptExecutionResult, TestSuiteResult } from 'concordialang-plugin';
import { fs as memfs, vol } from 'memfs';
import { join, normalize } from 'path';

import { ReportConverter } from '../src/ReportConverter';

describe( 'ReportConverter', () => {

    // helper variables

    // const dir = resolve( __dirname );
    const dir = normalize( process.cwd() );
    const reportFilePath = join( dir, 'report.json' );
    const pluginConfigPath = join( dir, 'codeceptJS.json' );

    const scriptFilePath = join( dir, 'test.js' );
    const scriptFileLine = 5;
    const scriptFileColumn = 7;

    const stackTrace = `expected web page to include "it will fail"

        Scenario Steps:

        - I.see( "it will fail" ) at Test.Scenario (${scriptFilePath}:${scriptFileLine}:${scriptFileColumn})
        - I.amOnPage( "/" ) at Test.Scenario (${scriptFilePath}:${scriptFileLine}:${scriptFileColumn - 1})`;

    const specFilePath = 'path/to/login.feature';
    const specFileLine = 50;
    const specKeyword = 'source';

    const report: any = {
        "stats": {
            "suites": 1,
            "tests": 2,
            "passes": 1,
            "pending": 0,
            "failures": 1,
            "start": "2017-11-06T00:20:32.304Z",
            "end": "2017-11-06T00:20:38.977Z",
            "duration": 6673
        },
        "tests": [
            {
                "title": "successful login",
                "fullTitle": "login: successful login",
                "duration": 1723,
                "currentRetry": 0,
                "err": {}
            },
            {
                "title": "unsuccessful login",
                "fullTitle": "login: unsuccessful login",
                "duration": 1655,
                "currentRetry": 0,
                "err": {
                    "params": {
                        "jar": "web page",
                        "customMessage": "",
                        "type": "to include",
                        "needle": "it will fail",
                        "haystack": "Login\nEnter"
                    },
                    "template": "{{customMessage}}expected {{jar}} {{type}} \"{{needle}}\"",
                    "showDiff": true,
                    "actual": "Login\nEnter",
                    "expected": "it will fail",
                    "message": "expected web page to include \"it will fail\"",
                    "stack": stackTrace
                }
            }
        ],
        "pending": [],
        "failures": [
            {
                "title": "unsuccessful login",
                "fullTitle": "login: unsuccessful login",
                "duration": 1655,
                "currentRetry": 0,
                "err": {
                    "params": {
                        "jar": "web page",
                        "customMessage": "",
                        "type": "to include",
                        "needle": "it will fail",
                        "haystack": "Login\nEnter"
                    },
                    "template": "{{customMessage}}expected {{jar}} {{type}} \"{{needle}}\"",
                    "showDiff": true,
                    "actual": "Login\nEnter",
                    "expected": "it will fail",
                    "message": "expected web page to include \"it will fail\"",
                    "stack": stackTrace
                }
            }
        ],
        "passes": [
            {
                "title": "successful login",
                "fullTitle": "login: successful login",
                "duration": 1723,
                "currentRetry": 0,
                "err": {}
            }
        ]
    };

    const pluginConfig: any = {
        "isFake": false,
        "packageName": "concordialang-codeceptjs",
        "name": "codeceptjs",
        "description": "Generates test scripts for CodeceptJS",
        "version": "0.1",
        "targets": [ "CodeceptJS" ],
        "authors": [],
        "file": "codeceptjs/CodeceptJS.ts",
        "class": "CodeceptJS"
    };

    const scriptFileLines: string[] = [
        `// ${specKeyword}: ${specFilePath}`,
        '',
        'describe( "foo", () => {',
        '   it( "bar", () => {',
        `       fake(); // (${specFileLine},1)`, // << this is the line number 5 in the script file
        '   } );',
        '} );'
    ];

    let createFiles = () => {

        // Synchronize the current path (IMPORTANT!)
        vol.mkdirpSync( dir );

        memfs.writeFileSync( reportFilePath, JSON.stringify( report ) );
        memfs.writeFileSync( pluginConfigPath, JSON.stringify( pluginConfig ) );
        memfs.writeFileSync( scriptFilePath, scriptFileLines.join( "\n" ) );
    };

    let eraseFiles = () => {
        vol.reset(); // erase in-memory files
    };

    beforeEach( createFiles );
    afterEach( eraseFiles );


    it( 'succefully converts a CodeceptJS report', async () => {

        let converter: ReportConverter = new ReportConverter( memfs ); // under test

        let received: TestScriptExecutionResult =
            await converter.convertFrom( reportFilePath, pluginConfigPath );

        let expectedMethod1:TestMethodResult = new TestMethodResult();
        expectedMethod1.durationMs = 1723;
        expectedMethod1.name = 'successful login';
        expectedMethod1.status = 'passed';

        let expectedMethod2:TestMethodResult = new TestMethodResult();
        expectedMethod2.durationMs = 1655;
        expectedMethod2.name = 'unsuccessful login';
        expectedMethod2.status = 'failed';
        expectedMethod2.exception = {
            message: 'expected web page to include "it will fail"',
            stackTrace: stackTrace,
            type: 'to include',

            scriptLocation: {
                filePath: scriptFilePath,
                line: scriptFileLine, // << important to retrieve spec line from the script file
                column: scriptFileColumn
            },

            specLocation: {
                filePath: specFilePath,
                line: specFileLine,
                column: 1
            }
        };

        let expectedSuite: TestSuiteResult = new TestSuiteResult();
        expectedSuite.suite = 'login';
        expectedSuite.methods = [ expectedMethod1, expectedMethod2 ];

        let expected: TestScriptExecutionResult = new TestScriptExecutionResult();
        expected.sourceFile = reportFilePath;
        expected.started = '2017-11-06T00:20:32.304Z';
        expected.finished = '2017-11-06T00:20:38.977Z';
        expected.durationMs = 6673;
        expected.total= {
            tests:  2,
            passed: 1,
            failed: 1,
            skipped: 0,
            error: 0,
            unknown: 0
        };
        expected.plugin = {
            description: 'Generates test scripts for CodeceptJS',
            name: 'codeceptjs',
            version: '0.1'
        };
        expected.results = [ expectedSuite ];

        expect( received ).toEqual( expected );
    } );

} );
