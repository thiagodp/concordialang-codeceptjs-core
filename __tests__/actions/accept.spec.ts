import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'accept', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    it( 'option alert', () => {
        let cmd: ATSCommand = {
            action: 'accept',
            options: [ 'alert' ]
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( 'I.acceptPopup();' + comment );
    } );

    it( 'option confirm', () => {
        let cmd: ATSCommand = {
            action: 'accept',
            options: [ 'confirm' ]
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( 'I.acceptPopup();' + comment );
    } );

    it( 'option prompt', () => {
        let cmd: ATSCommand = {
            action: 'accept',
            options: [ 'prompt' ]
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( 'I.acceptPopup();' + comment );
    } );

} );