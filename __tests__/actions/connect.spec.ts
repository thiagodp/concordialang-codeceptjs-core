import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

/**
 * @see https://github.com/thiagodp/codeceptjs-dbhelper
 */
describe( 'connect', () => {

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
			action: 'connect',
			options: [ 'database' ],
            values: [ 'foo', 'json:///C:\\bar.json' ]
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( `I.connect("foo", "json:///C:\\bar.json");` + comment );
	} );

} );
