import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

/**
 * @see https://github.com/thiagodp/codeceptjs-dbhelper
 */
describe( 'disconnect', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    it( 'value, option "database"', () => {
        let cmd: ATSCommand = {
			action: 'disconnect',
			options: [ 'database' ],
            values: [ 'foo' ]
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( `await I.disconnect("foo");` + comment );
	} );

} );
