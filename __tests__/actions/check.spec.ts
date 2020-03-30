import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'check', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    it( 'target', () => {
        let cmd: ATSCommand = {
            action: 'check',
            targets: [ '#foo' ],
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( `I.checkOption('#foo');` + comment );
    } );

    it( 'two targets', () => {
        let cmd: ATSCommand = {
            action: 'check',
            targets: [ '#foo', '#bar' ],
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( `I.checkOption('#foo', '#bar');` + comment );
    } );

    it( 'value, target', () => {
        let cmd: ATSCommand = {
            action: 'check',
            values: [ '#foo' ],
            targets: [ '#bar' ],
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( `I.checkOption("#foo", '#bar');` + comment );
    } );

    it( 'value', () => {
        let cmd: ATSCommand = {
            action: 'check',
            values: [ 'foo' ]
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( 'I.checkOption("foo");' + comment );
    } );

} );