import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

describe( 'refresh', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    describe( 'currentPage', () => {

        it( 'options', () => {
            let cmd: ATSCommand = {
                action: 'refresh',
                options: [ 'currentPage' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.refreshPage();' + comment );
        } );

    } );

    describe( 'page', () => {

        it( 'options', () => {
            let cmd: ATSCommand = {
                action: 'refresh',
                options: [ 'page' ]
            };
            const r = cm.map( cmd );
            expect( r ).toContainEqual( 'I.refreshPage();' + comment );
        } );

    } );

} );