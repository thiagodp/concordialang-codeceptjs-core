import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'click', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    it( 'value', () => {
        let cmd: ATSCommand = {
            action: 'click',
            values: [ 'foo' ]
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( `I.click("foo");` + comment );
    } );

    it( 'value, target', () => {
        let cmd: ATSCommand = {
            action: 'click',
            values: [ 'foo' ],
            targets: [ '#bar' ]
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( `I.click("foo", '#bar');` + comment );
    } );

    it( 'target', () => {
        let cmd: ATSCommand = {
            action: 'click',
            targets: [ '#foo' ],
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( `I.click('#foo');` + comment );
    } );

    it( 'two target', () => {
        let cmd: ATSCommand = {
            action: 'click',
            targets: [ '#foo', '#bar' ],
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( `I.click('#foo', '#bar');` + comment );
    } );

} );