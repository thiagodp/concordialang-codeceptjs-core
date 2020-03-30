import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'uncheck', () => {

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
            action: 'uncheck',
            targets: [ '#foo' ],
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( `I.uncheckOption('#foo');` + comment );
    } );

    it( 'two targets', () => {
        let cmd: ATSCommand = {
            action: 'uncheck',
            targets: [ '#foo', '#bar' ],
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( `I.uncheckOption('#foo', '#bar');` + comment );
    } );

    it( 'value, target', () => {
        let cmd: ATSCommand = {
            action: 'uncheck',
            values: [ '#foo' ],
            targets: [ '#bar' ],
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( `I.uncheckOption("#foo", '#bar');` + comment );
    } );

    it( 'value', () => {
        let cmd: ATSCommand = {
            action: 'uncheck',
            values: [ 'foo' ]
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( 'I.uncheckOption("foo");' + comment );
    } );

} );