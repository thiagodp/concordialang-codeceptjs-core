import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'rightClick', () => {

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
            action: 'rightClick',
            values: [ 'foo' ]
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( 'I.rightClick("foo");' + comment );
    } );

    it( 'target', () => {
        let cmd: ATSCommand = {
            action: 'rightClick',
            targets: [ '#foo' ],
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( 'I.rightClick(\'#foo\');' + comment );
    } );


} );