import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'switch', () => {

    let cm: CommandMapper; // under test
    const COMMENT = ' // (,)';
    const WITHIN_END = '});'

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    describe( 'app', () => {

        it( 'option', () => {
            let cmd: ATSCommand = {
                action: 'switch',
                options: [ 'app' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.switchTo();' + COMMENT );
        } );

        it( 'targetType', () => {
            let cmd: ATSCommand = {
                action: 'switch',
                targetTypes: [ 'app' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.switchTo();' + COMMENT );
        } );

    } );

    describe( 'currentPage', () => {

        it( 'option', () => {
            let cmd: ATSCommand = {
                action: 'switch',
                options: [ 'currentPage' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.switchTo();' + COMMENT );
        } );

        it( 'targetType', () => {
            let cmd: ATSCommand = {
                action: 'switch',
                targetTypes: [ 'currentPage' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.switchTo();' + COMMENT );
        } );

    } );


    describe( 'frame', () => {

        it( 'option', () => {
            let cmd: ATSCommand = {
                action: 'switch',
                options: [ 'frame' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.switchTo("iframe");' + COMMENT );
        } );

        it( 'option, value', () => {
            let cmd: ATSCommand = {
                action: 'switch',
                options: [ 'frame' ],
                values: [ '#foo' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.switchTo("#foo");' + COMMENT );
        } );

        it( 'targetTypes', () => {
            let cmd: ATSCommand = {
                action: 'switch',
                targetTypes: [ 'frame' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.switchTo("iframe");' + COMMENT );
        } );

        it( 'targetTypes, value', () => {
            let cmd: ATSCommand = {
                action: 'switch',
                targetTypes: [ 'frame' ],
                values: [ "#foo" ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.switchTo("#foo");' + COMMENT );
        } );

        it( 'targetTypes, one target', () => {
            let cmd: ATSCommand = {
                action: 'switch',
                targetTypes: [ 'frame' ],
                targets: [ "#foo" ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.switchTo('#foo');` + COMMENT );
        } );

        it( 'two targetTypes, one target', () => {
            let cmd: ATSCommand = {
                action: 'switch',
                targetTypes: [ 'frame', 'frame' ],
                targets: [ "#foo" ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( `I.switchTo('#foo');` + COMMENT );
        } );

    } );


    describe( 'native', () => {

        it( 'option', () => {
            let cmd: ATSCommand = {
                action: 'switch',
                options: [ 'native' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.switchToNative();' + COMMENT );
        } );

        it( 'option, value', () => {
            let cmd: ATSCommand = {
                action: 'switch',
                options: [ 'native' ],
                values: [ 'context' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.switchToNative("context");' + COMMENT );
        } );

    } );


    describe( 'web', () => {

        it( 'option', () => {
            let cmd: ATSCommand = {
                action: 'switch',
                options: [ 'web' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.switchToWeb();' + COMMENT );
        } );

        it( 'option, value', () => {
            let cmd: ATSCommand = {
                action: 'switch',
                options: [ 'web' ],
                values: [ 'context' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.switchToWeb("context");' + COMMENT );
        } );

    } );


    describe( 'tab', () => {

        it( 'option, number', () => {
            let cmd: ATSCommand = {
                action: 'switch',
                options: [ 'tab' ],
                values: [ '2' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.switchToNextTab(2);' + COMMENT );
        } );

        describe( 'next tab', () => {

            it( 'option', () => {
                let cmd: ATSCommand = {
                    action: 'switch',
                    options: [ 'next', 'tab' ]
                };
                const r = cm.map( cmd );
                expect( r ).toContainEqual( 'I.switchToNextTab();' + COMMENT );
            } );

        } );

        describe( 'previous tab', () => {

            it( 'option', () => {
                let cmd: ATSCommand = {
                    action: 'switch',
                    options: [ 'previous', 'tab' ]
                };
                const r = cm.map( cmd );
                expect( r ).toContainEqual( 'I.switchToPreviousTab();' + COMMENT );
            } );

        } );

    } );


    describe( 'bracket generation', () => {

        describe( 'open when', () => {

            it( 'switches to a frame within a frame', () => {

                const targets = [ "#foo", "#bar" ];

                const cmd: ATSCommand = {
                    action: 'switch',
                    targetTypes: [ 'frame', 'frame' ],
                    targets: targets
                };
                const result: string[] = cm.map( cmd );

                expect( result ).toEqual( [
                    `within({ frame: ['${targets[0]}', '${targets[1]}'] }, function() {` + COMMENT
                ] );
            } );

        } );

        describe( 'closes when', () => {

            it( 'switches to a page after switching to a frame', () => {

                const cmd: ATSCommand = {
                    action: 'switch',
                    targetTypes: [ 'frame', 'frame' ],
                    targets: [ "#foo", "#bar" ]
                };
                cm.map( cmd );

                const cmd2: ATSCommand = {
                    action: 'switch',
                    targetTypes: [ 'currentPage' ]
                };
                const result: string[] = cm.map( cmd2 );

                expect( result.map( r => r.trim() ) ).toEqual( [
                    WITHIN_END,
                    `I.switchTo();` + COMMENT
                ] );

            } );


            it( 'switches to a frame after switching to a frame', () => {

                const cmd: ATSCommand = {
                    action: 'switch',
                    targetTypes: [ 'frame', 'frame' ],
                    targets: [ "#foo", "#bar" ]
                };
                cm.map( cmd );

                const targets = [ "#zoo", "#zar" ];

                const cmd2: ATSCommand = {
                    action: 'switch',
                    targetTypes: [ 'frame', 'frame' ],
                    targets: targets
                };
                const result: string[] = cm.map( cmd2 );

                expect( result.map( r => r.trim() ) ).toEqual( [
                    WITHIN_END,
                    `within({ frame: ['${targets[0]}', '${targets[1]}'] }, function() {` + COMMENT
                ] );

            } );

        } );

    } );

} );