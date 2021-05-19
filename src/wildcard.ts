
/**
 * Add wildcard for JavaScript files, considering the given path.
 *
 * @param path Path
 * @returns string
 */
 export function addJSWildcard( path: string ): string {

	if ( ! path || /(\.js|\)|\})$/i.test( path ) ) {
		return path;
	}

	const isUnix = path.includes( '/' );
	if ( isUnix ) {
		if ( path.endsWith( '/' ) ) { // it's a folder
			return path + '**/*.js';
		}
		return path + '/**/*.js';
	}

	const isWin = path.includes( '\\' );
	if ( isWin ) {
		if ( path.endsWith( '\\' ) ) { // it's a folder
			return path + '**\\*.js';
		}
		return path + '\\**\\*.js';
	}

	return path + '/**/*.js';
}
