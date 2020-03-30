import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'see', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    describe( 'seeAppIsInstalled', () => {

        it( 'options, value', () => {
            let cmd: ATSCommand = {
                action: 'see',
                options: [ 'app', 'installed' ],
                values: [ 'foo.apk' ],
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.seeAppIsInstalled("foo.apk");' + comment );
        } );

    } );

    describe( 'seeAppIsNotInstalled', () => {

        it( 'options, value', () => {
            let cmd: ATSCommand = {
                action: 'see',
                options: [ 'app', 'installed' ],
                values: [ 'foo.apk' ],
                modifier: 'not',
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.seeAppIsNotInstalled("foo.apk");' + comment );
        } );

    } );

    describe( 'seeAttributesOnElements', () => {

        it( 'option "class", one value, one target', () => {
            let cmd: ATSCommand = {
                action: 'see',
                options: [ 'class' ],
                targets: [ '#foo' ],
                values: [ "active" ],
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.seeAttributesOnElements('#foo', {"class": "active"});` + comment );
        } );

        it( 'options "with" and "class", one value, one target', () => {
            let cmd: ATSCommand = {
                action: 'see',
                options: [ 'with', 'class' ],
                targets: [ '#foo' ],
                values: [ "active" ],
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.seeAttributesOnElements('#foo', {"class": "active"});` + comment );
        } );

        it( 'options "class" and "with", one value, one target', () => {
            let cmd: ATSCommand = {
                action: 'see',
                options: [ 'class', 'with' ],
                targets: [ '#foo' ],
                values: [ "active" ],
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.seeAttributesOnElements('#foo', {"class": "active"});` + comment );
        } );

        it( 'option "style", one value, one target', () => {
            let cmd: ATSCommand = {
                action: 'see',
                options: [ 'style' ],
                targets: [ '#foo' ],
                values: [ "color: blue" ],
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.seeAttributesOnElements('#foo', {"style": "color: blue"});` + comment );
        } );

        it( 'options "style" and "with", one value, one target', () => {
            let cmd: ATSCommand = {
                action: 'see',
                options: [ 'style', "with" ],
                targets: [ '#foo' ],
                values: [ "color: blue" ],
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.seeAttributesOnElements('#foo', {"style": "color: blue"});` + comment );
        } );

        it( 'options "with" and "style", one value, one target', () => {
            let cmd: ATSCommand = {
                action: 'see',
                options: [ 'with', 'style' ],
                targets: [ '#foo' ],
                values: [ "color: blue" ],
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.seeAttributesOnElements('#foo', {"style": "color: blue"});` + comment );
        } );

        it( 'option "attribute", two values, one target', () => {
            let cmd: ATSCommand = {
                action: 'see',
                options: [ 'attribute' ],
                targets: [ '#foo' ],
                values: [ "class", "active" ],
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.seeAttributesOnElements('#foo', {"class": "active"});` + comment );
        } );

    } );

    describe( 'seeCurrentActivityIs', () => {

        it( 'options, value', () => {
            let cmd: ATSCommand = {
                action: 'see',
                options: [ 'currentActivity' ],
                values: [ 'foo' ],
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.seeCurrentActivityIs("foo");' + comment );
        } );

    } );


    describe( 'seeDeviceIsLocked', () => {

        it( 'options, value', () => {
            let cmd: ATSCommand = {
                action: 'see',
                options: [ 'device', 'locked' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.seeDeviceIsLocked();' + comment );
        } );

    } );


    describe( 'seeDeviceIsUnlocked', () => {

        it( 'options, value', () => {
            let cmd: ATSCommand = {
                action: 'see',
                options: [ 'device', 'unlocked' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.seeDeviceIsUnlocked();' + comment );
        } );

    } );


    describe( 'seeInField', () => {

        it( 'option field, value, field', () => {
            let cmd: ATSCommand = {
                action: 'see',
                options: [ 'field' ],
                targets: [ '#foo' ],
                values: [ 'bar' ],
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.seeInField(\'#foo\', "bar");' + comment );
        } );

        it( 'targetType textbox, value, field', () => {
            let cmd: ATSCommand = {
                action: 'see',
                targetTypes: [ 'textbox' ],
                targets: [ '#foo' ],
                values: [ 'bar' ],
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.seeInField(\'#foo\', "bar");' + comment );
        } );

        it( 'targetType textarea, value, field', () => {
            let cmd: ATSCommand = {
                action: 'see',
                targetTypes: [ 'textarea' ],
                targets: [ '#foo' ],
                values: [ 'bar' ],
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.seeInField(\'#foo\', "bar");' + comment );
        } );

    } );


    describe( 'dontSeeInField', () => {

        it( 'targetTypes textbox, target, value, modifier', () => {
            let cmd: ATSCommand = {
                action: 'see',
                targetTypes: [ 'textbox' ],
                targets: [ '#foo' ],
                values: [ 'bar' ],
                modifier: 'not'
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.dontSeeInField(\'#foo\', "bar");' + comment );
        } );

        it( 'targetType textarea, target, value, modifier', () => {
            let cmd: ATSCommand = {
                action: 'see',
                targetTypes: [ 'textarea' ],
                targets: [ '#foo' ],
                values: [ 'bar' ],
                modifier: 'not'
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.dontSeeInField(\'#foo\', "bar");' + comment );
        } );

    } );


    describe( 'seeCheckboxIsChecked', () => {

        it( 'targetType checkbox, value, value', () => {
            let cmd: ATSCommand = {
                action: 'see',
                targetTypes: [ 'checkbox' ],
                options: [ 'checked' ],
                targets: [ '#foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.seeCheckboxIsChecked(\'#foo\');' + comment );
        } );

    } );


    describe( 'dontSeeCheckboxIsChecked', () => {

        it( 'targetType checkbox, value, value, modifier', () => {
            let cmd: ATSCommand = {
                action: 'see',
                targetTypes: [ 'checkbox' ],
                options: [ 'checked' ],
                targets: [ '#foo' ],
                modifier: 'not'
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.dontSeeCheckboxIsChecked(\'#foo\');' + comment );
        } );

    } );


    describe( 'seeCookie', () => {

        it( 'targetType cookie, value', () => {
            let cmd: ATSCommand = {
                action: 'see',
                targetTypes: [ 'cookie' ],
                values: [ 'foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.seeCookie("foo");' + comment );
        } );

        it( 'option cookie, value', () => {
            let cmd: ATSCommand = {
                action: 'see',
                options: [ 'cookie' ],
                values: [ 'foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.seeCookie("foo");' + comment );
        } );

    } );


    describe( 'dontSeeCookie', () => {

        it( 'targetType cookie, value, modifier', () => {
            let cmd: ATSCommand = {
                action: 'see',
                targetTypes: [ 'cookie' ],
                values: [ 'foo' ],
                modifier: 'not'
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.dontSeeCookie("foo");' + comment );
        } );

        it( 'option cookie, value, modifier', () => {
            let cmd: ATSCommand = {
                action: 'see',
                options: [ 'cookie' ],
                values: [ 'foo' ],
                modifier: 'not'
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.dontSeeCookie("foo");' + comment );
        } );

    } );


    describe( 'seeInTitle', () => {

        it( 'targetType title, value', () => {
            let cmd: ATSCommand = {
                action: 'see',
                targetTypes: [ 'title' ],
                values: [ 'foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.seeInTitle("foo");' + comment );
        } );

        it( 'option title, value', () => {
            let cmd: ATSCommand = {
                action: 'see',
                options: [ 'title' ],
                values: [ 'foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.seeInTitle("foo");' + comment );
        } );

    } );


    describe( 'dontSeeInTitle', () => {

        it( 'targetType title, value, modifier', () => {
            let cmd: ATSCommand = {
                action: 'see',
                targetTypes: [ 'title' ],
                values: [ 'foo' ],
                modifier: 'not'
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.dontSeeInTitle("foo");' + comment );
        } );

        it( 'option title, value, modifier', () => {
            let cmd: ATSCommand = {
                action: 'see',
                options: [ 'title' ],
                values: [ 'foo' ],
                modifier: 'not'
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.dontSeeInTitle("foo");' + comment );
        } );

    } );


    describe( 'seeInCurrentUrl', () => {

        it( 'targetType url, value', () => {
            let cmd: ATSCommand = {
                action: 'see',
                targetTypes: [ 'url' ],
                values: [ '/foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.seeInCurrentUrl("/foo");' + comment );
        } );

        it( 'option url, value', () => {
            let cmd: ATSCommand = {
                action: 'see',
                options: [ 'url' ],
                values: [ '/foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.seeInCurrentUrl("/foo");' + comment );
        } );

    } );

    describe( 'dontSeeInCurrentUrl', () => {

        it( 'targetType url, value, modifier', () => {
            let cmd: ATSCommand = {
                action: 'see',
                targetTypes: [ 'url' ],
                values: [ '/foo' ],
                modifier: 'not'
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.dontSeeInCurrentUrl("/foo");' + comment );
        } );

        it( 'option url, value, modifier', () => {
            let cmd: ATSCommand = {
                action: 'see',
                options: [ 'url' ],
                values: [ '/foo' ],
                modifier: 'not'
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.dontSeeInCurrentUrl("/foo");' + comment );
        } );

    } );


    describe( 'seeElement', () => {
        it( 'target', () => {
            let cmd: ATSCommand = {
                action: 'see',
                targets: [ '#foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.seeElement(\'#foo\');' + comment );
        } );
    } );


    describe( 'dontSeeElement', () => {
        it( 'target, modifier', () => {
            let cmd: ATSCommand = {
                action: 'see',
                targets: [ '#foo' ],
                modifier: 'not'
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.dontSeeElement(\'#foo\');' + comment );
        } );
    } );


    describe( 'seeOrientationIs', () => {

        it( 'options, value portrait', () => {
            let cmd: ATSCommand = {
                action: 'see',
                options: [ 'orientation', 'portrait' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.seeOrientationIs("PORTRAIT");' + comment );
        } );

        it( 'options, value landscape', () => {
            let cmd: ATSCommand = {
                action: 'see',
                options: [ 'orientation', 'landscape' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.seeOrientationIs("LANDSCAPE");' + comment );
        } );

    } );


    describe( 'see', () => {

        it( 'value', () => {
            let cmd: ATSCommand = {
                action: 'see',
                values: [ 'foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.see("foo");' + comment );
        } );

        it( 'value, option inside, target', () => {
            let cmd: ATSCommand = {
                action: 'see',
                values: [ 'bar' ],
                options: [ 'inside' ],
                targets: [ '#foo' ],
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.see("bar", \'#foo\');' + comment );
        } );

        it( 'target, option with, value', () => {
            let cmd: ATSCommand = {
                action: 'see',
                targets: [ '#foo' ],
                options: [ 'with' ],
                values: [ 'bar' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.see("bar", \'#foo\');' + comment );
        } );

    } );


    describe( 'dontSee', () => {

        it( 'value, modifier', () => {
            let cmd: ATSCommand = {
                action: 'see',
                values: [ 'foo' ],
                modifier: 'not'
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.dontSee("foo");' + comment );
        } );

        it( 'value, option inside, target, modifier', () => {
            let cmd: ATSCommand = {
                action: 'see',
                values: [ 'bar' ],
                options: [ 'inside' ],
                targets: [ '#foo' ],
                modifier: 'not'
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.dontSee("bar", \'#foo\');' + comment );
        } );


        it( 'target, option with, value, modifier', () => {
            let cmd: ATSCommand = {
                action: 'see',
                targets: [ '#foo' ],
                options: [ 'with' ],
                values: [ 'bar' ],
                modifier: 'not'
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.dontSee("bar", \'#foo\');' + comment );
        } );

    } );

} );