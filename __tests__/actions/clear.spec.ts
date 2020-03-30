import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'clear', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    describe( 'clearField', () => {

        it( 'target', () => {
            let cmd: ATSCommand = {
                action: 'clear',
                targets: [ '#foo' ],
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.clearField(\'#foo\');' + comment );
        } );

    } );

    describe( 'clearCookie', () => {

        it( 'targeType cookie, target', () => {
            let cmd: ATSCommand = {
                action: 'clear',
                targetTypes: [ 'cookie' ],
                targets: [ 'foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.clearCookie(\'foo\');' + comment );
        } );

    } );


} );