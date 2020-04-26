import { TestScriptExecutor } from '../src/TestScriptExecutor';
import { TestScriptExecutionOptions } from 'concordialang-plugin';
import "jest-extended";

describe( 'TestScriptExecutor', () => {

    let tse = new TestScriptExecutor( null );
    const s = `\\\\\\\"`;

    describe( '#makeCommand', () => {

        it( 'runs all the files by default', () => {
            const cmd = tse.makeCommand( {} );
            const expectedBeginning = 'npx codeceptjs run';
            expect( cmd ).toStartWith( expectedBeginning );
        } );

        // it( 'repass parameters', () => {
        //     const options: TestScriptExecutionOptions = {
        //         parameters: '--grep "Foo"'
        //     };
        //     const cmd = tse.makeCommand( options );
        //     const expectedBeginning = `npx codeceptjs run ${options.parameters}`;
        //     expect( cmd ).toStartWith( expectedBeginning );
        // } );

        it( 'runs a specific directory when defined', () => {
            const options: TestScriptExecutionOptions = {
                dirScript: 'tests'
            };
            const cmd = tse.makeCommand( options );
            const expectedBeginning = `npx codeceptjs run ${options.dirScript}`;
            expect( cmd ).toStartWith( expectedBeginning );
        } );

        it( 'runs a specific file when defined', () => {
            const options: TestScriptExecutionOptions = {
                file: '/path/to/foo.js'
            };
            const cmd = tse.makeCommand( options );
            const expectedBeginning = `npx codeceptjs run --override "{${s}tests${s}:${s}/path/to/foo.js${s}}"`;
            expect( cmd ).toStartWith( expectedBeginning );
        } );

        it( 'runs more than one file when defined', () => {
            const options: TestScriptExecutionOptions = {
                file: '/path/to/foo.js,bar.js,/far/zoo.js'
            };
            const cmd = tse.makeCommand( options );
            const expectedBeginning = `npx codeceptjs run --override "{${s}tests${s}:${s}{/path/to/foo.js,bar.js,/far/zoo.js}${s}}"`;
            expect( cmd ).toStartWith( expectedBeginning );
        } );

        it( 'adds a directory to tests when defined', () => {
            const options: TestScriptExecutionOptions = {
                dirScript: 'tests',
                file: 'foo.js,sub/bar.js,sub/sub2/zoo.js,sub/../zaz.js'
            };
            const cmd = tse.makeCommand( options );
            const expectedBeginning = `npx codeceptjs run --override "{${s}tests${s}:${s}{tests/foo.js,tests/sub/bar.js,tests/sub/sub2/zoo.js,tests/zaz.js}${s}}"`;
            expect( cmd ).toStartWith( expectedBeginning );
        } );

        it( 'can define an output directory', () => {
            const options: TestScriptExecutionOptions = {
                dirResult: 'dist'
            };
            const cmd = tse.makeCommand( options );
            const expectedBeginning = `npx codeceptjs run --override "{${s}output${s}:${s}dist${s}}"`;
            expect( cmd ).toStartWith( expectedBeginning );
        } );

        it( 'can define an output directory, a directory and files', () => {
            const options: TestScriptExecutionOptions = {
                dirResult: 'dist',
                dirScript: 'tests',
                file: 'foo.js,sub/bar.js,sub/sub2/zoo.js,sub/../zaz.js'
            };
            const cmd = tse.makeCommand( options );
            const expectedBeginning = `npx codeceptjs run --override "{${s}tests${s}:${s}{tests/foo.js,tests/sub/bar.js,tests/sub/sub2/zoo.js,tests/zaz.js}${s},${s}output${s}:${s}dist${s}}"`;
            expect( cmd ).toStartWith( expectedBeginning );
        } );

        it( 'can define an expression to search', () => {
            const options: TestScriptExecutionOptions = {
                grep: 'Foo|Bar'
            };
            const cmd = tse.makeCommand( options );
            const expectedBeginning = 'npx codeceptjs run --grep "Foo|Bar"';
            expect( cmd ).toStartWith( expectedBeginning );
        } );

        it( 'can define a directory and an expression to search', () => {
            const options: TestScriptExecutionOptions = {
                dirScript: 'tests',
                grep: 'Foo|Bar'
            };
            const cmd = tse.makeCommand( options );
            const expectedBeginning = 'npx codeceptjs run tests --grep "Foo|Bar"';
            expect( cmd ).toStartWith( expectedBeginning );
        } );

        it( 'accepts parallel execution', () => {
            const options: TestScriptExecutionOptions = {
                instances: 2
            };
            const cmd = tse.makeCommand( options );
            const expectedBeginning = `npx codeceptjs run-multiple parallel --override "{${s}multiple${s}:{${s}parallel${s}:{${s}chunks${s}:2}}}"`;
            expect( cmd ).toStartWith( expectedBeginning );
        } );

        it( 'accepts parallel execution with files', () => {
            const options: TestScriptExecutionOptions = {
                instances: 2,
                file: 'tests/foo.js,tests/sub/bar.js'
            };
            const cmd = tse.makeCommand( options );
            const expectedBeginning = `npx codeceptjs run-multiple parallel --override "{${s}tests${s}:${s}{tests/foo.js,tests/sub/bar.js}${s},${s}multiple${s}:{${s}parallel${s}:{${s}chunks${s}:2}}}"`;
            expect( cmd ).toStartWith( expectedBeginning );
        } );

        it( 'accepts parallel execution with files and targets', () => {
            const options: TestScriptExecutionOptions = {
                instances: 2,
                file: 'tests/foo.js,tests/sub/bar.js',
                target: 'chrome,firefox'
            };
            const cmd = tse.makeCommand( options );
            const expectedBeginning = `npx codeceptjs run-multiple parallel --override "{${s}tests${s}:${s}{tests/foo.js,tests/sub/bar.js}${s},${s}multiple${s}:{${s}parallel${s}:{${s}chunks${s}:2,${s}browsers${s}:[${s}chrome${s},${s}firefox${s}]}}}"`;
            expect( cmd ).toStartWith( expectedBeginning );
        } );

        it( 'accepts parallel execution with directory, files and targets', () => {
            const options: TestScriptExecutionOptions = {
                instances: 2,
                dirScript: 'tests',
                file: 'foo.js,sub/bar.js',
                target: 'chrome,firefox'
            };
            const cmd = tse.makeCommand( options );
            const expectedBeginning = `npx codeceptjs run-multiple parallel --override "{${s}tests${s}:${s}{tests/foo.js,tests/sub/bar.js}${s},${s}multiple${s}:{${s}parallel${s}:{${s}chunks${s}:2,${s}browsers${s}:[${s}chrome${s},${s}firefox${s}]}}}"`;
            expect( cmd ).toStartWith( expectedBeginning );
        } );

        it( 'accepts parallel execution with directory and targets', () => {
            const options: TestScriptExecutionOptions = {
                instances: 2,
                dirScript: 'tests',
                target: 'chrome,firefox'
            };
            const cmd = tse.makeCommand( options );
            const expectedBeginning = `npx codeceptjs run-multiple parallel tests --override "{${s}multiple${s}:{${s}parallel${s}:{${s}chunks${s}:2,${s}browsers${s}:[${s}chrome${s},${s}firefox${s}]}}}"`;
            expect( cmd ).toStartWith( expectedBeginning );
        } );

    } );


} );