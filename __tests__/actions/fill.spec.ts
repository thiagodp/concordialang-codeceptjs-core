import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'fill', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    it( 'target, value', () => {
        let cmd: ATSCommand = {
            action: 'fill',
            targets: [ '#foo' ],
            values: [ 'bar' ]
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( 'I.fillField(\'#foo\', "bar");' + comment );
    } );

} );