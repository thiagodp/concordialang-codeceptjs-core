import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'shake', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    it( 'nothing', () => {
        let cmd: ATSCommand = {
            action: 'shake'
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( 'I.shakeDevice();' + comment );
    } );

} );