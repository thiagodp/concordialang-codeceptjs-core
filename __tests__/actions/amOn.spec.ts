import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'amOn', () => {

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
            action: 'amOn',
            values: [ '/foo' ]
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( 'I.amOnPage("/foo");' + comment );
    } );

    it( 'targetType url, target', () => {
        let cmd: ATSCommand = {
            action: 'amOn',
            targetTypes: [ 'url' ],
            targets: [ '/foo' ]
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( 'I.amOnPage(\'/foo\');' + comment );
    } );

} );