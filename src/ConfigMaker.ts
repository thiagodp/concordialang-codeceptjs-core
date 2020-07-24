import { TestScriptExecutionOptions } from 'concordialang-plugin';
import { join, relative } from 'path';

import { HelperConfiguration } from './HelperConfiguration';

const toUnixPath = ( path: string ): string => {
    return path.replace( /\\/g, '/' );
};

/**
 * Configuration maker
 */
export class ConfigMaker {

    /**
     * Make a basic CodeceptJS configuration.
     *
     * @param filter Filter for test files.
     * @param output Output folder. Default is "./output".
     * @param outputFile Output report file. Default is 'output.json'.
     */
    makeBasicConfig(
        filter: string = 'test/**/*.js',
        output: string = './output',
        outputFile: string = 'output.json'
    ) {
        const testsFilter = toUnixPath( relative( process.cwd(), filter ) );
        const outputDir = toUnixPath( relative( process.cwd(), output ) );

        return {
            "tests": testsFilter,
            "output": outputDir,
            "helpers": {},
            "bootstrap": false,
            "mocha": {
                "reporterOptions": {

                    "codeceptjs-cli-reporter": {
                        "stdout": "-",
                        "options": {
                            "steps": true
                        }
                    },

                    "json": {
                        "stdout": join( outputDir, outputFile )
                    },

                    "mochawesome": {
                        "stdout": "-",
                        "options": {
                            "reportDir": outputDir,
                            "reportFilename": "report",
                            "uniqueScreenshotNames": true,
                            "timestamp": false
                        }
                    },
                }
            },

            /**
             * Não afeta execução normal, mas só se rodar com
             * `codeceptjs run-parallel parallel`
             *
             * @see TestScriptExecutor
             */
            "multiple": {
                "parallel": {
                    "chunks": 2
                }
            }
        };
    }


    public hasHelper(
        config: any,
        hc: HelperConfiguration
    ): boolean {
        const helpers = this.ensureHelpersProperty( config );
        const name = hc.name();
        return !! helpers[ name ];
    }

    public setHelper(
        config: any,
        hc: HelperConfiguration,
        execOptions: TestScriptExecutionOptions
    ): void {
        const helpers = this.ensureHelpersProperty( config );
        const name = hc.name();
        helpers[ name ] = hc.generate( execOptions );
    }

    /**
     * Ensure that the given configurations have a helpers property.
     *
     * @param config Target configuration.
     *
     * @returns A reference to the helpers property.
     */
    protected ensureHelpersProperty( config: any ): any {
        if ( ! config.helpers ) {
            config.helpers = {};
        }
        return config.helpers;
    }

    /**
     * Returns true whether the given configuration has a helpers property.
     *
     * @param config Target configuration
     */
    hasHelpersProperty( config: any ): boolean {
        return ! config.helpers ? false : true;
    }

}
