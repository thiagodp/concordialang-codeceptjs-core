import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'swipe', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );


    describe( 'a target', () => {

        it( 'two numbers', () => {
            let cmd: ATSCommand = {
                action: 'swipe',
                values: [ '100', '200' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.performSwipe(100, 200);' + comment );
        } );

        it( 'value, two numbers', () => {
            let cmd: ATSCommand = {
                action: 'swipe',
                values: [ 'foo', '100', '200' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.swipe("foo", 100, 200);' + comment );
        } );

        it( 'value, three numbers', () => {
            let cmd: ATSCommand = {
                action: 'swipe',
                values: [ 'foo', '100', '200', '3000' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.swipe("foo", 100, 200, 3000);' + comment );
        } );

    } );


    describe( 'swipeDown', () => {

        it( 'value, number', () => {
            let cmd: ATSCommand = {
                action: 'swipe',
                options: [ 'down' ],
                values: [ 'foo', '100' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.swipeDown("foo", 100);' + comment );
        } );

        it( 'value, two numbers', () => {
            let cmd: ATSCommand = {
                action: 'swipe',
                options: [ 'down' ],
                values: [ 'foo', '100', '3000' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.swipeDown("foo", 100, 3000);' + comment );
        } );

    } );


    describe( 'swipeLeft', () => {

        it( 'value, number', () => {
            let cmd: ATSCommand = {
                action: 'swipe',
                options: [ 'left' ],
                values: [ 'foo', '100' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.swipeLeft("foo", 100);' + comment );
        } );

        it( 'value, two numbers', () => {
            let cmd: ATSCommand = {
                action: 'swipe',
                options: [ 'left' ],
                values: [ 'foo', '100', '3000' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.swipeLeft("foo", 100, 3000);' + comment );
        } );

    } );


    describe( 'swipeRight', () => {

        it( 'value, number', () => {
            let cmd: ATSCommand = {
                action: 'swipe',
                options: [ 'right' ],
                values: [ 'foo', '100' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.swipeRight("foo", 100);' + comment );
        } );

        it( 'value, two numbers', () => {
            let cmd: ATSCommand = {
                action: 'swipe',
                options: [ 'right' ],
                values: [ 'foo', '100', '3000' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.swipeRight("foo", 100, 3000);' + comment );
        } );

    } );


    describe( 'swipeUp', () => {

        it( 'value, number', () => {
            let cmd: ATSCommand = {
                action: 'swipe',
                options: [ 'up' ],
                values: [ 'foo', '100' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.swipeUp("foo", 100);' + comment );
        } );

        it( 'value, two numbers', () => {
            let cmd: ATSCommand = {
                action: 'swipe',
                options: [ 'up' ],
                values: [ 'foo', '100', '3000' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.swipeUp("foo", 100, 3000);' + comment );
        } );

    } );


} );