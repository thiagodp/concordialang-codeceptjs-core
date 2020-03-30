import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'hide', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    describe( 'keyboard', () => {

        it( 'options', () => {
            let cmd: ATSCommand = {
                action: 'hide',
                options: [ 'keyboard' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.hideDeviceKeyboard();' + comment );
        } );

    } );

} );