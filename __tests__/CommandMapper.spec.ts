import { ATSCommand } from 'concordialang-plugin';
import { CommandMapper } from '../src/CommandMapper';
import { CODECEPTJS_COMMANDS } from '../src/Commands';

describe( 'CommandMapper', () => {

    let cm: CommandMapper; // under test

    const EMPTY_COMMENT = '// (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    describe( '#escapeDoubleQuotes', () => {
        it( 'escape', () => {
            expect( cm.escapeDoubleQuotes( `//*[id="foo"]/a[2]/button` ) )
                .toEqual( `//*[id=\\"foo\\"]/a[2]/button` );
        } );

        it( 'does not escape escaped quotes', () => {
            expect( cm.escapeDoubleQuotes( `//*[id=\\"foo\\"]/a[2]/button` ) )
                .toEqual( `//*[id=\\"foo\\"]/a[2]/button` );
        } );
    } );

    describe( '#escapeSingleQuotes', () => {
        it( 'escape', () => {
            expect( cm.escapeSingleQuotes( `//*[id='foo']/a[2]/button` ) )
                .toEqual( `//*[id=\\'foo\\']/a[2]/button` );
        } );

        it( 'does not escape escaped single quotes', () => {
            expect( cm.escapeSingleQuotes( `//*[id=\\'foo\\']/a[2]/button` ) )
                .toEqual( `//*[id=\\'foo\\']/a[2]/button` );
        } );
    } );

    describe( '#withinCount', () => {

        describe( 'increases by 1 when switch action to iframe target type with', () => {

            it( 'two targets are found', () => {
                const cmd: ATSCommand = {
                    action: 'switch',
                    targetTypes: [ 'frame', 'frame' ],
                    targets: [ "#foo", "#bar" ]
                };
                cm.map( cmd ); // ignore output
                expect( cm.withinCount() ).toBe( 1 );
            } );

            it( 'three targets are found', () => {
                const cmd: ATSCommand = {
                    action: 'switch',
                    targetTypes: [ 'frame', 'frame', 'frame' ],
                    targets: [ "#foo", "#bar", "#baz" ]
                };
                cm.map( cmd ); // ignore output
                expect( cm.withinCount() ).toBe( 1 );
            } );

            it( 'more than three targets are found', () => {
                const cmd: ATSCommand = {
                    action: 'switch',
                    targetTypes: [ 'frame', 'frame', 'frame', 'frame' ],
                    targets: [ "#foo", "#bar", "#baz", "#zoo" ]
                };
                cm.map( cmd ); // ignore output
                expect( cm.withinCount() ).toBe( 1 );
            } );
        } );


        describe( 'decreases by 1 if it is greater than 0 and', () => {

            it( 'switches to page', () => {

                const cmd: ATSCommand = {
                    action: 'switch',
                    targetTypes: [ 'frame', 'frame' ],
                    targets: [ "#foo", "#bar" ]
                };
                cm.map( cmd ); // should increase

                const cmd2: ATSCommand = {
                    action: 'switch',
                    targetTypes: [ 'currentPage' ],
                };
                cm.map( cmd2 ); // should decrease

                expect( cm.withinCount() ).toBe( 0 );
            } );

        } );

        it( 'keeps the counting after switching twice', () => {

            const cmd: ATSCommand = {
                action: 'switch',
                targetTypes: [ 'frame', 'frame' ],
                targets: [ "#foo", "#bar" ]
            };
            cm.map( cmd ); // should increase

            const cmd2: ATSCommand = {
                action: 'switch',
                targetTypes: [ 'frame', 'frame' ],
                targets: [ "#zoo", "#zar" ]
            };
            cm.map( cmd2 ); // should decrease then increase

            expect( cm.withinCount() ).toBe( 1 );
        } );

        it( 'keeps the counting after switching thrice', () => {

            const cmd: ATSCommand = {
                action: 'switch',
                targetTypes: [ 'frame', 'frame' ],
                targets: [ "#foo", "#bar" ]
            };
            cm.map( cmd ); // should increase

            const cmd2: ATSCommand = {
                action: 'switch',
                targetTypes: [ 'frame', 'frame' ],
                targets: [ "#zoo", "#zar" ]
            };
            cm.map( cmd2 ); // should decrease then increase

            const cmd3: ATSCommand = {
                action: 'switch',
                targetTypes: [ 'frame', 'frame' ],
                targets: [ "#foo", "#bar" ]
            };
            cm.map( cmd3 ); // should decrease then increase

            expect( cm.withinCount() ).toBe( 1 );
        } );

    } );



} );