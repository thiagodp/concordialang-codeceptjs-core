import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'open', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    describe( 'notifications', () => {

        it( 'options', () => {
            let cmd: ATSCommand = {
                action: 'open',
                options: [ 'notifications' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.openNotifications();' + comment );
        } );

    } );

} );