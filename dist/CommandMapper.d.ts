import { ATSCommand } from "concordialang-plugin";
/**
 * Command comparison
 */
export declare enum CmdCmp {
    ONE_VALUE = 0,
    ONE_VALUE__OR_ARRAY = 1,
    ONE_VALUE__ONE_NUMBER = 2,
    ONE_VALUE__TWO_NUMBERS = 3,
    ONE_VALUE__THREE_NUMBERS = 4,
    ONE_VALUE__ONE_TARGET = 5,
    ONE_VALUE_OR_NUMBER = 6,
    ONE_VALUE_OR_NUMBER__ONE_NUMBER = 7,
    ONE_VALUE_OR_NUMBER__ONE_TARGET = 8,
    ONE_VALUE_OR_NUMBER__OR_ARRAY = 9,
    ONE_NUMBER = 10,
    ONE_NUMBER__ONE_TARGET = 11,
    ONE_TARGET = 12,
    ONE_TARGET__ONE_VALUE = 13,
    ONE_TARGET__ONE_NUMBER = 14,
    ONE_TARGET__ONE_VALUE_OR_NUMBER = 15,
    ONE_TARGET__TWO_NUMBERS = 16,
    ONE_TARGET__THREE_NUMBERS = 17,
    SAME_TARGET_TYPE = 18,
    SAME_TARGET_TYPE__ONE_NUMBER = 19,
    SAME_TARGET_TYPE__ONE_VALUE = 20,
    SAME_TARGET_TYPE__ONE_VALUE__ONE_NUMBER = 21,
    SAME_TARGET_TYPE__ONE_TARGET = 22,
    SAME_TARGET_TYPE__ONE_TARGET__ONE_NUMBER = 23,
    SAME_TARGET_TYPE__ONE_TARGET__ONE_NUMBER__ONE_VALUE = 24,
    SAME_TARGET_TYPE__ONE_TARGET__TWO_NUMBERS = 25,
    SAME_TARGET_TYPE__ONE_TARGET__ONE_VALUE_OR_NUMBER = 26,
    SAME_TARGET_TYPE__ONE_TARGET__ONE_VALUE__ONE_NUMBER = 27,
    SAME_TARGET_TYPE__MANY_TARGETS = 28,
    SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER = 29,
    SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER__ONE_NUMBER = 30,
    SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER__ONE_NUMBER__ONE_TARGET = 31,
    SAME_OPTION = 32,
    SAME_OPTION__ONE_NUMBER = 33,
    SAME_OPTION__ONE_VALUE = 34,
    SAME_OPTION__ONE_VALUE__ONE_NUMBER = 35,
    SAME_OPTION__ONE_VALUE__ONE_NUMBER__ONE_TARGET = 36,
    SAME_OPTION__ONE_VALUE__ONE_NUMBER__ONE_VALUE = 37,
    SAME_OPTION__ONE_VALUE__TWO_NUMBERS = 38,
    SAME_OPTION__ONE_VALUE_OR_NUMBER = 39,
    SAME_OPTION__ONE_VALUE_OR_NUMBER__ONE_NUMBER = 40,
    SAME_OPTION__ONE_TARGET = 41,
    SAME_OPTION__ONE_TARGET__ONE_NUMBER = 42,
    SAME_OPTION__ONE_TARGET__TWO_NUMBERS = 43,
    SAME_OPTION__ONE_TARGET__ONE_VALUE = 44,
    SAME_OPTION__ONE_TARGET__ONE_VALUE_OR_NUMBER = 45,
    SAME_OPTION__ONE_TARGET__ONE_VALUE_OR_NUMBER__ONE_NUMBER = 46,
    SAME_OPTION__ONE_TARGET__ONE_VALUE__ONE_NUMBER = 47,
    SAME_OPTION__MANY_TARGETS = 48,
    SAME_OPTION__SAME_TARGET_TYPE = 49,
    SAME_OPTION__SAME_TARGET_TYPE__ONE_NUMBER = 50,
    SAME_OPTION__SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER = 51,
    SAME_OPTION__SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER__ONE_NUMBER = 52,
    SAME_OPTION__SAME_TARGET_TYPE__ONE_TARGET = 53,
    SAME_OPTION__SAME_TARGET_TYPE__ONE_TARGET__ONE_NUMBER = 54,
    SAME_MODIFIER__ONE_VALUE = 55,
    SAME_MODIFIER__ONE_VALUE_OR_NUMBER = 56,
    SAME_MODIFIER__ONE_TARGET = 57,
    SAME_MODIFIER__SAME_OPTION = 58,
    SAME_MODIFIER__SAME_OPTION__ONE_VALUE = 59,
    SAME_MODIFIER__SAME_OPTION__ONE_VALUE_OR_NUMBER = 60,
    SAME_MODIFIER__SAME_OPTION__ONE_TARGET = 61,
    SAME_MODIFIER__SAME_OPTION__ONE_TARGET__ONE_VALUE = 62,
    SAME_MODIFIER__SAME_OPTION__ONE_TARGET__ONE_VALUE_OR_NUMBER = 63,
    SAME_MODIFIER__SAME_OPTION__ONE_TARGET__TWO_VALUES = 64,
    SAME_MODIFIER__SAME_OPTION__SAME_TARGET_TYPE__ONE_TARGET = 65,
    SAME_MODIFIER__SAME_TARGET_TYPE__ONE_VALUE = 66,
    SAME_MODIFIER__SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER = 67,
    SAME_MODIFIER__SAME_TARGET_TYPE__ONE_TARGET__ONE_VALUE = 68,
    SAME_MODIFIER__SAME_TARGET_TYPE__ONE_TARGET__ONE_VALUE_OR_NUMBER = 69,
    TWO_TARGETS = 70,
    TWO_VALUES_SAME_OPTION = 71,
    TWO_NUMBERS = 72,
    TWO_NUMBERS_SAME_OPTION = 73,
    TWO_NUMBERS_SAME_TARGET_TYPE = 74
}
export declare enum OptionsOptions {
    OPTION_AS_PROPERTY__FIRST_VALUE_AS_VALUE = 1,
    FIRST_VALUE_AS_PROPERTY__SECOND_VALUE_AS_VALUE = 2
}
/**
 * Command configuration
 *
 * @author Thiago Delgado Pinto
 */
export interface CmdCfg {
    action: string;
    comp: CmdCmp;
    modifier?: string;
    options?: string[];
    targetTypes?: string | string[];
    template: string;
    optionsOption?: OptionsOptions;
    valuesAsNonArray?: boolean;
    singleQuotedValues?: boolean;
    singleQuotedTargets?: boolean;
}
/**
 * Command mapper
 *
 * @author Thiago Delgado Pinto
 */
export declare class CommandMapper {
    protected commands: CmdCfg[];
    private _withinCount;
    constructor(commands: CmdCfg[]);
    withinCount(): number;
    private setWithinCount;
    /**
     * Converts an abstract test script command into one or more lines of code.
     *
     * @param cmd Abstract test script command
     */
    map(cmd: ATSCommand): string[];
    /**
     * Make one or more lines of code from the given command configuration and
     * abstract test script command.
     *
     * @param cfg Command configuration
     * @param cmd Abstract test script command
     * @returns Lines of code.
     */
    makeCommands(cfg: CmdCfg, cmd: ATSCommand): string[];
    /**
     * Make a code comment with the data of a abstract test script command.
     *
     * @param cmd Abstract test script command
     */
    makeCommentWithCommand(cmd: ATSCommand): string;
    serializeCommand(cmd: ATSCommand): string;
    /**
     * Returns true whether the command configuration is compatible with the
     * given abstract test script command.
     *
     * @param cfg Command configuration
     * @param cmd Abstract test script command
     */
    areCompatible(cfg: CmdCfg, cmd: ATSCommand): boolean;
    /**
     * Convert targets to function parameters.
     *
     * @param targets Targets to convert, usually UI literals.
     * @param singleQuotedTargets Whether the targets should be wrapped with single quotes.
     */
    private targetsToParameters;
    private convertSingleTarget;
    /**
     * Convert values to function parameters.
     *
     * @param values Values to convert.
     * @param valueAsNonArrayWhenGreaterThanOne Whether wants to convert an
     *      array to single values when its size is greater than one.
     * @param singleQuotedValues Whether is desired to use single quotes.
     */
    private valuesToParameters;
    private convertSingleValue;
    escapeDoubleQuotes(value: string): string;
    escapeSingleQuotes(value: string): string;
}
