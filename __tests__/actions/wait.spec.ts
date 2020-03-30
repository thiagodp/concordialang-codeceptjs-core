import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'wait', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    describe( 'waitUrlEquals', () => {

        it( 'targetType, value', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                targetTypes: [ 'url' ],
                values: [ '/foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.waitUrlEquals("/foo");' + comment );
        } );

        it( 'targetType, value, number', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                targetTypes: [ 'url' ],
                values: [ '/foo', '5' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.waitUrlEquals("/foo", 5);' + comment );
        } );

        it( 'option, value', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'url' ],
                values: [ '/foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.waitUrlEquals("/foo");' + comment );
        } );

        it( 'option, value, number', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'url' ],
                values: [ '/foo', '5' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.waitUrlEquals("/foo", 5);' + comment );
        } );

        it( 'option, target', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'url' ],
                targets: [ '/foo' ],
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitUrlEquals('/foo');` + comment );
        } );

        it( 'option, target, number', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'url' ],
                targets: [ '/foo' ],
                values: [ '5' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitUrlEquals('/foo', 5);` + comment );
        } );

    } );


    describe( 'waitForVisible', () => {

        it( 'option, target', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'visible' ],
                targets: [ '#foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForVisible('#foo');` + comment );
        } );

        it( 'option, target, number', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'visible' ],
                targets: [ '#foo' ],
                values: [ '5' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForVisible('#foo', 5);` + comment );
        } );

        it( 'option, value', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'visible' ],
                values: [ '#foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForVisible("#foo");` + comment );
        } );

        it( 'option, value, number', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'visible' ],
                values: [ '#foo', '5' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForVisible("#foo", 5);` + comment );
        } );

    } );


    describe( 'waitForInvisible', () => {

        it( 'option, target', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'invisible' ],
                targets: [ '#foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForInvisible('#foo');` + comment );
        } );

        it( 'option, target, number', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'invisible' ],
                targets: [ '#foo' ],
                values: [ '5' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForInvisible('#foo', 5);` + comment );
        } );

        it( 'option, value', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'invisible' ],
                values: [ '#foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForInvisible("#foo");` + comment );
        } );

        it( 'option, value, number', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'invisible' ],
                values: [ '#foo', '5' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForInvisible("#foo", 5);` + comment );
        } );

    } );


    describe( 'waitForEnabled', () => {

        it( 'option, target', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'enabled' ],
                targets: [ '#foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForEnabled('#foo');` + comment );
        } );

        it( 'option, target, number', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'enabled' ],
                targets: [ '#foo' ],
                values: [ '5' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForEnabled('#foo', 5);` + comment );
        } );

        it( 'option, value', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'enabled' ],
                values: [ '#foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForEnabled("#foo");` + comment );
        } );

        it( 'option, value, number', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'enabled' ],
                values: [ '#foo', '5' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForEnabled("#foo", 5);` + comment );
        } );

    } );


    describe( 'waitToHide', () => {

        it( 'option, target', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'hidden' ],
                targets: [ '#foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitToHide('#foo');` + comment );
        } );

        it( 'option, target, number', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'hidden' ],
                targets: [ '#foo' ],
                values: [ '5' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitToHide('#foo', 5);` + comment );
        } );

        it( 'option, value', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'hidden' ],
                values: [ '#foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitToHide("#foo");` + comment );
        } );

        it( 'option, value, number', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'hidden' ],
                values: [ '#foo', '5' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitToHide("#foo", 5);` + comment );
        } );

    } );


    describe( 'waitForElement', () => {

        it( 'target', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                targets: [ '#foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForElement('#foo');` + comment );
        } );

        it( 'target, number', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                targets: [ '#foo' ],
                values: [ '5' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForElement('#foo', 5);` + comment );
        } );

        it( 'value', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                values: [ '#foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.waitForElement("#foo");' + comment );
        } );

        it( 'value, number', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                values: [ '#foo', '5' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForElement("#foo", 5);` + comment );
        } );

    } );


    describe( 'waitForText', () => {

        it( 'targetType text, target', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                targetTypes: [ 'text' ],
                targets: [ 'foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForText('foo');` + comment );
        } );

        it( 'targetType text, target, number', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                targetTypes: [ 'text' ],
                targets: [ 'foo' ],
                values: [ '5' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForText('foo', 5);` + comment );
        } );

        it( 'option text, value', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'text' ],
                values: [ 'foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForText("foo");` + comment );
        } );

        it( 'option text, value, number', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'text' ],
                values: [ 'foo', '5' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForText("foo", 5);` + comment );
        } );

        it( 'option text, value, number, value', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'text' ],
                values: [ 'foo', '5', '#bar' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForText("foo", 5, "#bar");` + comment );
        } );

        it( 'option text, value, number, target', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'text' ],
                values: [ 'foo', '5' ],
                targets: [ '#bar' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForText("foo", 5, '#bar');` + comment );
        } );

        it( 'option text, target', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'text' ],
                targets: [ 'bar' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForText('bar');` + comment );
        } );

        it( 'option text, target, number', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'text' ],
                targets: [ 'bar' ],
                values: [ '5' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForText('bar', 5);` + comment );
        } );

    } );


    describe( 'waitForValue', () => {

        it( 'option, target, value', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'value' ],
                targets: [ '#foo' ],
                values: [ 'bar' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForValue('#foo', "bar");` + comment );
        } );

        it( 'option, target, value, number', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'value' ],
                targets: [ '#foo' ],
                values: [ 'bar', '5' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitForValue('#foo', "bar", 5);` + comment );
        } );

    } );


    describe( 'waitNumberOfVisibleElements', () => {

        it( 'options, target, number', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                options: [ 'visible', 'elements' ],
                targets: [ '#foo' ],
                values: [ '7' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.waitNumberOfVisibleElements('#foo', 7);` + comment );
        } );

    } );


    describe( 'some time', () => {

        it( 'number', () => {
            let cmd: ATSCommand = {
                action: 'wait',
                values: [ '3' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.wait(3);' + comment );
        } );

    } );

} );