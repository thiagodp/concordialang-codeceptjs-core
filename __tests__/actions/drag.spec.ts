import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'drag', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    it( 'two targets', () => {
        let cmd: ATSCommand = {
            action: 'drag',
            targets: [ '#foo', '#bar' ],
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( 'I.dragAndDrop(\'#foo\', \'#bar\');' + comment );
    } );

} );