import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'maximize', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    describe( 'window', () => {

        it( 'options', () => {
            let cmd: ATSCommand = {
                action: 'maximize',
                options: [ 'window' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.resizeWindow("maximize");' + comment );
        } );

    } );

} );