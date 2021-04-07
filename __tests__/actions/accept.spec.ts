import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'accept', () => {

    let cm: CommandMapper; // under test

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    describe( 'without a message', () => {

        const comment = ' // (,)';

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

        it( 'option popup', () => {
            let cmd: ATSCommand = {
                action: 'accept',
                options: [ 'popup' ]
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



    describe( 'with a message', () => {

        const regex = /const popupText[0-9]+ = await I.grabPopupText\(\); I.acceptPopup\(\); assert.equal\(popupText[0-9]+, "Hello"\); \/\/ \(,\)/;

        it( 'option alert', () => {
            let cmd: ATSCommand = {
                action: 'accept',
                options: [ 'alert' ],
                values: ["Hello"]
            };
            const r = cm.map( cmd );
            expect( r[ 0 ] ).toMatch( regex );
        } );

        it( 'option confirm', () => {
            let cmd: ATSCommand = {
                action: 'accept',
                options: [ 'confirm' ],
                values: ["Hello"]
            };
            const r = cm.map( cmd );
            expect( r[ 0 ] ).toMatch( regex );
        } );

        it( 'option popup', () => {
            let cmd: ATSCommand = {
                action: 'accept',
                options: [ 'popup' ],
                values: ["Hello"]
            };
            const r = cm.map( cmd );
            expect( r[ 0 ] ).toMatch( regex );
        } );

        it( 'option prompt', () => {
            let cmd: ATSCommand = {
                action: 'accept',
                options: [ 'prompt' ],
                values: ["Hello"]
            };
            const r = cm.map( cmd );
            expect( r[ 0 ] ).toMatch( regex );
        } );

    } );

} );