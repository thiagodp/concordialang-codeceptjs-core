import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'doubleClick', () => {

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
            action: 'doubleClick',
            values: [ 'foo' ]
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( 'I.doubleClick("foo");' + comment );
    } );

    it( 'target', () => {
        let cmd: ATSCommand = {
            action: 'doubleClick',
            targets: [ '#foo' ],
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( 'I.doubleClick(\'#foo\');' + comment );
    } );

    it( 'two targets', () => {
        let cmd: ATSCommand = {
            action: 'doubleClick',
            targets: [ '#foo', '#bar' ],
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( `I.doubleClick('#foo', '#bar');` + comment );
    } );

} );