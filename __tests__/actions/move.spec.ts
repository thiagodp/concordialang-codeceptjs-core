import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'move', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    describe( 'moveCursorTo', () => {

        it( 'options, target', () => {
            let cmd: ATSCommand = {
                action: 'move',
                options: [ 'cursor' ],
                targets: [ '#foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.moveCursorTo(\'#foo\');' + comment );
        } );

        it( 'options, target, two numbers', () => {
            let cmd: ATSCommand = {
                action: 'move',
                options: [ 'cursor' ],
                targets: [ '#foo' ],
                values: [ '100', '200' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.moveCursorTo(\'#foo\', 100, 200);' + comment );
        } );

    } );

} );