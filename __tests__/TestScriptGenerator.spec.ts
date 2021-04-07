import { AbstractTestScript, ATSCommand } from 'concordialang-plugin';

import { CommandMapper } from '../src/CommandMapper';
import { CODECEPTJS_COMMANDS } from '../src/Commands';
import { TestScriptGenerator } from '../src/TestScriptGenerator';

describe( 'TestScriptGenerator', () => {

    let gen: TestScriptGenerator; // under test

    const assertLine = 'const assert = require("assert").strict;';

    const LINES_TO_IGNORE = 5;

    function uglify(string: string): string{
        return string.replace(/(\r\n|\n|\r|[ \t])/gm, '');
    }

    function compare( testCase: AbstractTestScript, expected: string ) {
        const original = gen.generate( testCase );
        const lines = original.split( "\n" ).splice( LINES_TO_IGNORE - 1 );
        const adjusted = lines.join( "\n" );
        expect( uglify( adjusted ) ).toBe( uglify( expected ) );
    }

    beforeEach(() => {
        gen = new TestScriptGenerator(
            new CommandMapper( CODECEPTJS_COMMANDS )
        );
    });

    afterEach( () => {
        gen = null;
	} );


	describe( '#analyzeConverted', () => {

		it( 'returns and empty array when all arguments are undefined', () => {
			expect( gen.analyzeConverted( undefined, undefined, undefined ) ).toEqual( [] );
			expect( gen.analyzeConverted( [], undefined, undefined ) ).toEqual( [] );
			expect( gen.analyzeConverted( undefined, new ATSCommand(), undefined ) ).toEqual( [] );
			expect( gen.analyzeConverted( undefined, undefined, new AbstractTestScript() ) ).toEqual( [] );
		} );

		it( 'returns a comment with the command when the converted list is empty', () => {
			const r = gen.analyzeConverted( [], new ATSCommand(), new AbstractTestScript() );
			expect( r ).toEqual( [ '// COMMAND NOT ACCEPTED -> ' ] );
		} );

	} );


    it( 'generates code for a feature without scenarios and testcases', () => {

        let testCase = {
            "schemaVersion": "1.0",
            "sourceFile": "path/to/somefile.testcase",
            "feature": {
                "location": { "column": 1, "line": 1 },
                "name": "login"
            },
            "scenarios": [],
            "testcases": []
        } as AbstractTestScript;

        let expected = `
            ${assertLine}
            Feature("login");
        `;

        compare( testCase, expected );
    } );


    it( 'generates code for test cases of two different scenarios, even without commands', () => {

        let testCase = {
            "schemaVersion": "1.0",
            "sourceFile": "path/to/somefile.testcase",
            "feature": {
                "location": { "column": 1, "line": 1 },
                "name": "login"
            },
            "scenarios": [
                {
                    "location": { "column": 1, "line": 3 },
                    "name": "successful login"
                },
                {
                    "location": { "column": 1, "line": 3 },
                    "name": "unsuccessful login"
                }
            ],
            "testcases": [
                {
                    "location": { "column": 1, "line": 40 },
                    "scenario": "successful login",
                    "name": "finishes successfully valid values",
                    "commands": []
                },
                {
                    "location": { "column": 1, "line": 41 },
                    "scenario": "unsuccessful login",
                    "name": "finishes unsuccessfully invalid values",
                    invalid: true,
                    "commands": []
                }
            ]
        } as AbstractTestScript;

        let expected = `
            ${assertLine}
            Feature("login");
            Scenario("successful login | finishes successfully valid values", async (I) => {});
            Scenario("unsuccessful login | finishes unsuccessfully invalid values", async (I) => {});
        `;

        compare( testCase, expected );
    } );


    it( 'generates code for a single test case', () => {

        let testCase = {
            "schemaVersion": "1.0",
            "sourceFile": "path/to/somefile.testcase",
            "feature": {
                "location": { "column": 1, "line": 1 },
                "name": "login"
            },
            "scenarios": [
                {
                    "location": { "column": 1, "line": 3 },
                    "name": "successful login"
                }
            ],
            "testcases": [
                {
                    "location": { "column": 1, "line": 39 },
                    "scenario": "successful login",
                    "name": "finishes successfully with valid values",

                    "commands": [
                        {
                            "location": { "column": 1, "line": 40 },
                            "action": "see",
                            "values": [ "Login" ],
                        },
                        {
                            "location": { "column": 1, "line": 41 },
                            "action": "fill",
                            "targets": [ "#username" ],
                            "targetTypes": [ "textbox" ],
                            "values": [ "bob" ]
                        },
                        {
                            "location": { "column": 1, "line": 42 },
                            "action": "fill",
                            "targets": [ "#password" ],
                            "targetTypes": [ "textbox" ],
                            "values": [ "b0bp4s$" ]
                        },
                        {
                            "location": { "column": 1, "line": 43 },
                            "action": "click",
                            "targets": [ "#enter" ],
                            "targetTypes": [ "button" ]
                        }
                    ]
                }
            ]
        } as AbstractTestScript;

        let expected = `
            ${assertLine}

            Feature("login");

            Scenario("successful login | finishes successfully with valid values", async (I) => {
                I.see("Login"); // (40,1)
                I.fillField('#username', "bob"); // (41,1)
                I.fillField('#password', "b0bp4s$"); // (42,1)
                I.click('#enter'); // (43,1)
            });
        `;

        compare( testCase, expected );
    } );


    it( 'generates code for more than one test case', () => {

        let testCase = {
            "schemaVersion": "1.0",
            "sourceFile": "path/to/somefile.testcase",
            "feature": {
                "location": { "column": 1, "line": 1 },
                "name": "login"
            },
            "scenarios": [
                {
                    "location": { "column": 1, "line": 3 },
                    "name": "successful login"
                }
            ],
            "testcases": [
                {
                    "location": { "column": 1, "line": 40 },
                    "scenario": "successful login",
                    "name": "finishes successfully with valid values",

                    "commands": [
                        {
                            "location": { "column": 1, "line": 41 },
                            "action": "see",
                            "values": [ "Login" ]
                        },
                        {
                            "location": { "column": 1, "line": 42 },
                            "action": "fill",
                            "targets": [ "#username" ],
                            "targetTypes": [ "textbox" ],
                            "values": [ "bob" ]
                        },
                        {
                            "location": { "column": 1, "line": 43 },
                            "action": "fill",
                            "targets": [ "#password" ],
                            "targetTypes": [ "textbox" ],
                            "values": [ "b0bp4s$" ]
                        },
                        {
                            "location": { "column": 1, "line": 44 },
                            "action": "click",
                            "targets": [ "#enter" ],
                            "targetTypes": [ "button" ]
                        }
                    ]
                },


                {
                    "location": { "column": 1, "line": 40 },
                    "scenario": "unsuccessful login",
                    "name": "finishes unsuccessfully with invalid values",
                    "invalid": true,

                    "commands": [
                        {
                            "location": { "column": 1, "line": 41 },
                            "action": "see",
                            "values": [ "Login" ]
                        },
                        {
                            "location": { "column": 1, "line": 42 },
                            "action": "fill",
                            "targets": [ "#username" ],
                            "targetTypes": [ "textbox" ],
                            "values": [ "kdsldhçs dwd" ],
                            "invalid": true
                        },
                        {
                            "location": { "column": 1, "line": 43 },
                            "action": "fill",
                            "targets": [ "#password" ],
                            "targetTypes": [ "textbox" ],
                            "values": [ "d0d s98 23923 2 32$" ],
                            "invalid": true
                        },
                        {
                            "location": { "column": 1, "line": 44 },
                            "action": "click",
                            "targets": [ "#enter" ],
                            "targetTypes": [ "button" ]
                        }
                    ]
                }
            ]
        } as AbstractTestScript;

        let expected = `
            ${assertLine}

            Feature("login");

            Scenario("successful login | finishes successfully with valid values", async (I) => {
                I.see("Login"); // (41,1)
                I.fillField('#username', "bob"); // (42,1)
                I.fillField('#password', "b0bp4s$"); // (43,1)
                I.click('#enter'); // (44,1)
            });

            Scenario("unsuccessful login | finishes unsuccessfully with invalid values", async (I) => {
                I.see("Login"); // (41,1)
                I.fillField('#username', "kdsldhçs dwd"); // (42,1)
                I.fillField('#password', "d0d s98 23923 2 32$"); // (43,1)
                I.click('#enter'); // (44,1)
            });
        `;

        compare( testCase, expected );
	} );


	it( 'generates event', () => {

        let testCase = {
            "schemaVersion": "1.0",
            "sourceFile": "path/to/somefile.testcase",
			beforeEachScenario: {
				commands: [
					{
						location: { "line": 3, "column": 3 },
						action: "connect", options: [ 'database' ], values: [
							'mydb', 'json:///C:\\db.json'
						],
					},
					{
						location: { "line": 4, "column": 3 },
						action: "run", options: [ 'command' ], values: [ 'INSERT INTO foo VALUES ("bar")' ],
					},
				]
			}
        } as AbstractTestScript;

		let expected = `
            ${assertLine}
			Feature("");
            Before( async (I) => { // Before Each Scenario
				I.connect("mydb", "json:///C:\\db.json"); // (3,3)
				await I.runCommand('INSERT INTO foo VALUES ("bar")'); // (4,3)
			});
        `;

        compare( testCase, expected );
    } );


} );
