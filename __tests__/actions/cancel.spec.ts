import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'cancel', () => {

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
            action: 'cancel',
            options: [ 'alert' ]
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( 'I.cancelPopup();' + comment );
    } );

    it( 'option confirm', () => {
        let cmd: ATSCommand = {
            action: 'cancel',
            options: [ 'confirm' ]
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( 'I.cancelPopup();' + comment );
    } );

    it( 'option prompt', () => {
        let cmd: ATSCommand = {
            action: 'cancel',
            options: [ 'prompt' ]
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( 'I.cancelPopup();' + comment );
    } );

} );