import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'rotate', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );


    it( 'two numbers', () => {
        let cmd: ATSCommand = {
            action: 'rotate',
            values: [ '100', '200' ]
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( 'I.rotate(100, 200);' + comment );
    } );

} );