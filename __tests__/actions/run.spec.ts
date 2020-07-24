import { ATSCommand } from "concordialang-plugin";
import { CommandMapper } from "../../src/CommandMapper";
import { CODECEPTJS_COMMANDS } from "../../src/Commands";

/**
 * @see https://github.com/thiagodp/codeceptjs-dbhelper
 * @see https://github.com/thiagodp/codeceptjs-cmdhelper
 */
describe( 'run', () => {

    let cm: CommandMapper; // under test
    const comment = ' // (,)';

    beforeEach( () => {
        cm = new CommandMapper( CODECEPTJS_COMMANDS );
    } );

    afterEach( () => {
        cm = null;
    } );

    it( 'value, option "script"', () => {
        let cmd: ATSCommand = {
			action: 'run',
			options: [ 'script' ],
            values: [ 'foo', 'INSERT INTO foo VALUES ("bar")' ]
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( `await I.run('foo', 'INSERT INTO foo VALUES ("bar")');` + comment );
	} );


    it( 'value, option "command"', () => {
        let cmd: ATSCommand = {
			action: 'run',
			options: [ 'command' ],
            values: [ 'foo --bar' ]
        };
        const r = cm.map( cmd );
        expect( r ).toContainEqual( `await I.runCommand('foo --bar');` + comment );
    } );

} );
