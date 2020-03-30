import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'saveScreenshot', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    it( 'value', () => {
        let cmd: ATSCommand = {
            action: 'saveScreenshot',
            values: [ 'foo' ]
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( 'I.saveScreenshot("foo");' + comment );
    } );


} );