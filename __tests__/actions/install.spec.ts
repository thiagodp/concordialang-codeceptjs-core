import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'install', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    it( 'option, value', () => {
        let cmd: ATSCommand = {
            action: 'install',
            options: [ 'app' ],
            values: [ 'foo.apk' ]
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( 'I.installApp("foo.apk");' + comment );
    } );

} );