import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'close', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    describe( 'app', () => {

        it( 'options', () => {
            let cmd: ATSCommand = {
                action: 'close',
                options: [ 'app' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.closeApp();' + comment );
        } );

    } );

    describe( 'currentTab', () => {

        it( 'targetType', () => {
            let cmd: ATSCommand = {
                action: 'close',
                targetTypes: [ 'currentTab' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.closeCurrentTab();' + comment );
        } );

        it( 'options', () => {
            let cmd: ATSCommand = {
                action: 'close',
                options: [ 'currentTab' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.closeCurrentTab();' + comment );
        } );

    } );

    describe( 'otherTabs', () => {

        it( 'targetType', () => {
            let cmd: ATSCommand = {
                action: 'close',
                targetTypes: [ 'otherTabs' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.closeOtherTabs();' + comment );
        } );

        it( 'options', () => {
            let cmd: ATSCommand = {
                action: 'close',
                options: [ 'otherTabs' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.closeOtherTabs();' + comment );
        } );

    } );

} );