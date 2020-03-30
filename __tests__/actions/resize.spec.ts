import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'resize', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    describe( 'window', () => {

        it( 'options, numbers', () => {
            let cmd: ATSCommand = {
                action: 'resize',
                options: [ 'window' ],
                values: [ 300, 400 ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.resizeWindow(300, 400);' + comment );
        } );

    } );


} );