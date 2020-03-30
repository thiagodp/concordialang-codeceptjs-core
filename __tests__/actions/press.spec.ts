import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'press', () => {

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
            action: 'press',
            values: [ 'Enter' ],
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( 'I.pressKey("Enter");' + comment );
    } );

    it( 'array', () => {
        let cmd: ATSCommand = {
            action: 'press',
            values: [ 'Ctrl', 'S' ],
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( 'I.pressKey(["Ctrl", "S"]);' + comment );
    } );

} );