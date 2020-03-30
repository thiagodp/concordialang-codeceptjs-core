import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'select', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    it( 'works with one target and one value', () => {
        let cmd: ATSCommand = {
            action: 'select',
            targets: [ '#foo' ],
            values: [ 'bar' ]
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( 'I.selectOption(\'#foo\', "bar");' + comment );
    } );


} );