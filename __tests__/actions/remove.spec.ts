import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'remove', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    describe( 'app', () => {

        it( 'options, value', () => {
            let cmd: ATSCommand = {
                action: 'remove',
                options: [ 'app' ],
                values: [ 'foo.apk' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.removeApp("foo.apk");' + comment );
        } );

    } );

} );