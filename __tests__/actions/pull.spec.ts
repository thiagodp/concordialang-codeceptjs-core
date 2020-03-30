import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'pull', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    describe( 'file', () => {

        it( 'options, two values', () => {
            let cmd: ATSCommand = {
                action: 'pull',
                options: [ 'file' ],
                values: [ 'foo.png', 'bar.png' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.pullFile("foo.png", "bar.png");' + comment );
        } );

    } );

} );