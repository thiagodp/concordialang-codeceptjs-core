"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandMapper = exports.OptionsOptions = exports.CmdCmp = void 0;
const mustache_1 = require("mustache");
/**
 * Command comparison
 */
var CmdCmp;
(function (CmdCmp) {
    CmdCmp[CmdCmp["ONE_VALUE"] = 0] = "ONE_VALUE";
    CmdCmp[CmdCmp["ONE_VALUE__OR_ARRAY"] = 1] = "ONE_VALUE__OR_ARRAY";
    CmdCmp[CmdCmp["ONE_VALUE__ONE_NUMBER"] = 2] = "ONE_VALUE__ONE_NUMBER";
    CmdCmp[CmdCmp["ONE_VALUE__TWO_NUMBERS"] = 3] = "ONE_VALUE__TWO_NUMBERS";
    CmdCmp[CmdCmp["ONE_VALUE__THREE_NUMBERS"] = 4] = "ONE_VALUE__THREE_NUMBERS";
    CmdCmp[CmdCmp["ONE_VALUE__ONE_TARGET"] = 5] = "ONE_VALUE__ONE_TARGET";
    CmdCmp[CmdCmp["ONE_VALUE_OR_NUMBER"] = 6] = "ONE_VALUE_OR_NUMBER";
    CmdCmp[CmdCmp["ONE_VALUE_OR_NUMBER__ONE_NUMBER"] = 7] = "ONE_VALUE_OR_NUMBER__ONE_NUMBER";
    CmdCmp[CmdCmp["ONE_VALUE_OR_NUMBER__ONE_TARGET"] = 8] = "ONE_VALUE_OR_NUMBER__ONE_TARGET";
    CmdCmp[CmdCmp["ONE_VALUE_OR_NUMBER__OR_ARRAY"] = 9] = "ONE_VALUE_OR_NUMBER__OR_ARRAY";
    CmdCmp[CmdCmp["ONE_NUMBER"] = 10] = "ONE_NUMBER";
    CmdCmp[CmdCmp["ONE_NUMBER__ONE_TARGET"] = 11] = "ONE_NUMBER__ONE_TARGET";
    CmdCmp[CmdCmp["ONE_TARGET"] = 12] = "ONE_TARGET";
    CmdCmp[CmdCmp["ONE_TARGET__ONE_VALUE"] = 13] = "ONE_TARGET__ONE_VALUE";
    CmdCmp[CmdCmp["ONE_TARGET__ONE_NUMBER"] = 14] = "ONE_TARGET__ONE_NUMBER";
    CmdCmp[CmdCmp["ONE_TARGET__ONE_VALUE_OR_NUMBER"] = 15] = "ONE_TARGET__ONE_VALUE_OR_NUMBER";
    CmdCmp[CmdCmp["ONE_TARGET__TWO_NUMBERS"] = 16] = "ONE_TARGET__TWO_NUMBERS";
    CmdCmp[CmdCmp["ONE_TARGET__THREE_NUMBERS"] = 17] = "ONE_TARGET__THREE_NUMBERS";
    CmdCmp[CmdCmp["SAME_TARGET_TYPE"] = 18] = "SAME_TARGET_TYPE";
    CmdCmp[CmdCmp["SAME_TARGET_TYPE__ONE_NUMBER"] = 19] = "SAME_TARGET_TYPE__ONE_NUMBER";
    CmdCmp[CmdCmp["SAME_TARGET_TYPE__ONE_VALUE"] = 20] = "SAME_TARGET_TYPE__ONE_VALUE";
    CmdCmp[CmdCmp["SAME_TARGET_TYPE__ONE_VALUE__ONE_NUMBER"] = 21] = "SAME_TARGET_TYPE__ONE_VALUE__ONE_NUMBER";
    CmdCmp[CmdCmp["SAME_TARGET_TYPE__ONE_TARGET"] = 22] = "SAME_TARGET_TYPE__ONE_TARGET";
    CmdCmp[CmdCmp["SAME_TARGET_TYPE__ONE_TARGET__ONE_NUMBER"] = 23] = "SAME_TARGET_TYPE__ONE_TARGET__ONE_NUMBER";
    CmdCmp[CmdCmp["SAME_TARGET_TYPE__ONE_TARGET__ONE_NUMBER__ONE_VALUE"] = 24] = "SAME_TARGET_TYPE__ONE_TARGET__ONE_NUMBER__ONE_VALUE";
    CmdCmp[CmdCmp["SAME_TARGET_TYPE__ONE_TARGET__TWO_NUMBERS"] = 25] = "SAME_TARGET_TYPE__ONE_TARGET__TWO_NUMBERS";
    CmdCmp[CmdCmp["SAME_TARGET_TYPE__ONE_TARGET__ONE_VALUE_OR_NUMBER"] = 26] = "SAME_TARGET_TYPE__ONE_TARGET__ONE_VALUE_OR_NUMBER";
    CmdCmp[CmdCmp["SAME_TARGET_TYPE__ONE_TARGET__ONE_VALUE__ONE_NUMBER"] = 27] = "SAME_TARGET_TYPE__ONE_TARGET__ONE_VALUE__ONE_NUMBER";
    CmdCmp[CmdCmp["SAME_TARGET_TYPE__MANY_TARGETS"] = 28] = "SAME_TARGET_TYPE__MANY_TARGETS";
    CmdCmp[CmdCmp["SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER"] = 29] = "SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER";
    CmdCmp[CmdCmp["SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER__ONE_NUMBER"] = 30] = "SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER__ONE_NUMBER";
    CmdCmp[CmdCmp["SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER__ONE_NUMBER__ONE_TARGET"] = 31] = "SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER__ONE_NUMBER__ONE_TARGET";
    CmdCmp[CmdCmp["SAME_OPTION"] = 32] = "SAME_OPTION";
    CmdCmp[CmdCmp["SAME_OPTION__ONE_NUMBER"] = 33] = "SAME_OPTION__ONE_NUMBER";
    CmdCmp[CmdCmp["SAME_OPTION__ONE_VALUE"] = 34] = "SAME_OPTION__ONE_VALUE";
    CmdCmp[CmdCmp["SAME_OPTION__ONE_VALUE__ONE_NUMBER"] = 35] = "SAME_OPTION__ONE_VALUE__ONE_NUMBER";
    CmdCmp[CmdCmp["SAME_OPTION__ONE_VALUE__ONE_NUMBER__ONE_TARGET"] = 36] = "SAME_OPTION__ONE_VALUE__ONE_NUMBER__ONE_TARGET";
    CmdCmp[CmdCmp["SAME_OPTION__ONE_VALUE__ONE_NUMBER__ONE_VALUE"] = 37] = "SAME_OPTION__ONE_VALUE__ONE_NUMBER__ONE_VALUE";
    CmdCmp[CmdCmp["SAME_OPTION__ONE_VALUE__TWO_NUMBERS"] = 38] = "SAME_OPTION__ONE_VALUE__TWO_NUMBERS";
    CmdCmp[CmdCmp["SAME_OPTION__ONE_VALUE_OR_NUMBER"] = 39] = "SAME_OPTION__ONE_VALUE_OR_NUMBER";
    CmdCmp[CmdCmp["SAME_OPTION__ONE_VALUE_OR_NUMBER__ONE_NUMBER"] = 40] = "SAME_OPTION__ONE_VALUE_OR_NUMBER__ONE_NUMBER";
    CmdCmp[CmdCmp["SAME_OPTION__ONE_TARGET"] = 41] = "SAME_OPTION__ONE_TARGET";
    CmdCmp[CmdCmp["SAME_OPTION__ONE_TARGET__ONE_NUMBER"] = 42] = "SAME_OPTION__ONE_TARGET__ONE_NUMBER";
    CmdCmp[CmdCmp["SAME_OPTION__ONE_TARGET__TWO_NUMBERS"] = 43] = "SAME_OPTION__ONE_TARGET__TWO_NUMBERS";
    CmdCmp[CmdCmp["SAME_OPTION__ONE_TARGET__ONE_VALUE"] = 44] = "SAME_OPTION__ONE_TARGET__ONE_VALUE";
    CmdCmp[CmdCmp["SAME_OPTION__ONE_TARGET__ONE_VALUE_OR_NUMBER"] = 45] = "SAME_OPTION__ONE_TARGET__ONE_VALUE_OR_NUMBER";
    CmdCmp[CmdCmp["SAME_OPTION__ONE_TARGET__ONE_VALUE_OR_NUMBER__ONE_NUMBER"] = 46] = "SAME_OPTION__ONE_TARGET__ONE_VALUE_OR_NUMBER__ONE_NUMBER";
    CmdCmp[CmdCmp["SAME_OPTION__ONE_TARGET__ONE_VALUE__ONE_NUMBER"] = 47] = "SAME_OPTION__ONE_TARGET__ONE_VALUE__ONE_NUMBER";
    CmdCmp[CmdCmp["SAME_OPTION__MANY_TARGETS"] = 48] = "SAME_OPTION__MANY_TARGETS";
    CmdCmp[CmdCmp["SAME_OPTION__SAME_TARGET_TYPE"] = 49] = "SAME_OPTION__SAME_TARGET_TYPE";
    CmdCmp[CmdCmp["SAME_OPTION__SAME_TARGET_TYPE__ONE_NUMBER"] = 50] = "SAME_OPTION__SAME_TARGET_TYPE__ONE_NUMBER";
    CmdCmp[CmdCmp["SAME_OPTION__SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER"] = 51] = "SAME_OPTION__SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER";
    CmdCmp[CmdCmp["SAME_OPTION__SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER__ONE_NUMBER"] = 52] = "SAME_OPTION__SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER__ONE_NUMBER";
    CmdCmp[CmdCmp["SAME_OPTION__SAME_TARGET_TYPE__ONE_TARGET"] = 53] = "SAME_OPTION__SAME_TARGET_TYPE__ONE_TARGET";
    CmdCmp[CmdCmp["SAME_OPTION__SAME_TARGET_TYPE__ONE_TARGET__ONE_NUMBER"] = 54] = "SAME_OPTION__SAME_TARGET_TYPE__ONE_TARGET__ONE_NUMBER";
    CmdCmp[CmdCmp["SAME_MODIFIER__ONE_VALUE"] = 55] = "SAME_MODIFIER__ONE_VALUE";
    CmdCmp[CmdCmp["SAME_MODIFIER__ONE_VALUE_OR_NUMBER"] = 56] = "SAME_MODIFIER__ONE_VALUE_OR_NUMBER";
    CmdCmp[CmdCmp["SAME_MODIFIER__ONE_TARGET"] = 57] = "SAME_MODIFIER__ONE_TARGET";
    CmdCmp[CmdCmp["SAME_MODIFIER__SAME_OPTION"] = 58] = "SAME_MODIFIER__SAME_OPTION";
    CmdCmp[CmdCmp["SAME_MODIFIER__SAME_OPTION__ONE_VALUE"] = 59] = "SAME_MODIFIER__SAME_OPTION__ONE_VALUE";
    CmdCmp[CmdCmp["SAME_MODIFIER__SAME_OPTION__ONE_VALUE_OR_NUMBER"] = 60] = "SAME_MODIFIER__SAME_OPTION__ONE_VALUE_OR_NUMBER";
    CmdCmp[CmdCmp["SAME_MODIFIER__SAME_OPTION__ONE_TARGET"] = 61] = "SAME_MODIFIER__SAME_OPTION__ONE_TARGET";
    CmdCmp[CmdCmp["SAME_MODIFIER__SAME_OPTION__ONE_TARGET__ONE_VALUE"] = 62] = "SAME_MODIFIER__SAME_OPTION__ONE_TARGET__ONE_VALUE";
    CmdCmp[CmdCmp["SAME_MODIFIER__SAME_OPTION__ONE_TARGET__ONE_VALUE_OR_NUMBER"] = 63] = "SAME_MODIFIER__SAME_OPTION__ONE_TARGET__ONE_VALUE_OR_NUMBER";
    CmdCmp[CmdCmp["SAME_MODIFIER__SAME_OPTION__ONE_TARGET__TWO_VALUES"] = 64] = "SAME_MODIFIER__SAME_OPTION__ONE_TARGET__TWO_VALUES";
    CmdCmp[CmdCmp["SAME_MODIFIER__SAME_OPTION__SAME_TARGET_TYPE__ONE_TARGET"] = 65] = "SAME_MODIFIER__SAME_OPTION__SAME_TARGET_TYPE__ONE_TARGET";
    CmdCmp[CmdCmp["SAME_MODIFIER__SAME_TARGET_TYPE__ONE_VALUE"] = 66] = "SAME_MODIFIER__SAME_TARGET_TYPE__ONE_VALUE";
    CmdCmp[CmdCmp["SAME_MODIFIER__SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER"] = 67] = "SAME_MODIFIER__SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER";
    CmdCmp[CmdCmp["SAME_MODIFIER__SAME_TARGET_TYPE__ONE_TARGET__ONE_VALUE"] = 68] = "SAME_MODIFIER__SAME_TARGET_TYPE__ONE_TARGET__ONE_VALUE";
    CmdCmp[CmdCmp["SAME_MODIFIER__SAME_TARGET_TYPE__ONE_TARGET__ONE_VALUE_OR_NUMBER"] = 69] = "SAME_MODIFIER__SAME_TARGET_TYPE__ONE_TARGET__ONE_VALUE_OR_NUMBER";
    CmdCmp[CmdCmp["TWO_TARGETS"] = 70] = "TWO_TARGETS";
    CmdCmp[CmdCmp["TWO_VALUES_SAME_OPTION"] = 71] = "TWO_VALUES_SAME_OPTION";
    CmdCmp[CmdCmp["TWO_NUMBERS"] = 72] = "TWO_NUMBERS";
    CmdCmp[CmdCmp["TWO_NUMBERS_SAME_OPTION"] = 73] = "TWO_NUMBERS_SAME_OPTION";
    CmdCmp[CmdCmp["TWO_NUMBERS_SAME_TARGET_TYPE"] = 74] = "TWO_NUMBERS_SAME_TARGET_TYPE";
})(CmdCmp = exports.CmdCmp || (exports.CmdCmp = {}));
var OptionsOptions;
(function (OptionsOptions) {
    // E.g. action: "see", target: "#foo", options: [ "class" ], values: [ "active" ] -> {"class": "active"}
    OptionsOptions[OptionsOptions["OPTION_AS_PROPERTY__FIRST_VALUE_AS_VALUE"] = 1] = "OPTION_AS_PROPERTY__FIRST_VALUE_AS_VALUE";
    // E.g. action: "see", target: "#foo", options: [ "attribute" ], values: [ "class", "active" ] -> {"class": "active"}
    OptionsOptions[OptionsOptions["FIRST_VALUE_AS_PROPERTY__SECOND_VALUE_AS_VALUE"] = 2] = "FIRST_VALUE_AS_PROPERTY__SECOND_VALUE_AS_VALUE";
})(OptionsOptions = exports.OptionsOptions || (exports.OptionsOptions = {}));
/**
 * Command mapper
 *
 * @author Thiago Delgado Pinto
 */
class CommandMapper {
    constructor(commands) {
        this.commands = commands;
        this._withinCount = 0;
    }
    withinCount() {
        return this._withinCount;
    }
    setWithinCount(value) {
        this._withinCount = value;
        if (this._withinCount < 0) {
            this._withinCount = 0;
        }
    }
    /**
     * Converts an abstract test script command into one or more lines of code.
     *
     * @param cmd Abstract test script command
     */
    map(cmd) {
        let cmdCfg = this.commands.find(cfg => this.areCompatible(cfg, cmd));
        if (!cmdCfg) {
            return [];
        }
        return this.makeCommands(cmdCfg, cmd);
    }
    /**
     * Make one or more lines of code from the given command configuration and
     * abstract test script command.
     *
     * @param cfg Command configuration
     * @param cmd Abstract test script command
     * @returns Lines of code.
     */
    makeCommands(cfg, cmd) {
        // singleQuotedTargets defaults to true if undefined
        if (undefined === cfg.singleQuotedTargets) {
            cfg.singleQuotedTargets = true;
        }
        const COMMENT_TEMPLATE = ' // ({{{location.line}}},{{{location.column}}}){{#comment}} {{{comment}}}{{/comment}}';
        const TABULATION = "\t";
        if (!!cmd["db"] && cmd.action === 'connect') {
            const values = {
                value: ['"' + cmd.values[0] + '"', JSON.stringify(cmd["db"])],
                location: cmd.location,
                comment: cmd.comment,
            };
            const template = cfg.template + COMMENT_TEMPLATE;
            return [(0, mustache_1.render)(template, values)];
        }
        let result = [];
        if ('switch' === cmd.action && this.withinCount() > 0) {
            // Add "} );" if it already is in a "within"
            const endWithinBlock = '});';
            const tabs = TABULATION.repeat(this.withinCount() - 1);
            result.push(`${tabs}${endWithinBlock}`);
            // Set to 0 instead of decreasing, since current
            // implementation will avoid a within inside a within.
            this.setWithinCount(0);
        }
        let valueToRender = !cmd.values
            ? ''
            : this.valuesToParameters(cmd.values, cfg.valuesAsNonArray, cfg.singleQuotedValues);
        switch (cfg.optionsOption) {
            case OptionsOptions.OPTION_AS_PROPERTY__FIRST_VALUE_AS_VALUE: {
                const [firstCfgOption] = cfg.options; // From CFG, not CMD !
                const [firstValue] = cmd.values;
                if (firstCfgOption !== undefined && firstValue !== undefined) {
                    valueToRender = `{"${firstCfgOption}": "${firstValue}"}`;
                }
                break;
            }
            case OptionsOptions.FIRST_VALUE_AS_PROPERTY__SECOND_VALUE_AS_VALUE: {
                const [firstValue, secondValue] = cmd.values;
                if (firstValue !== undefined && secondValue !== undefined) {
                    valueToRender = `{"${firstValue}": "${secondValue}"}`;
                }
                break;
            }
            default: ; // no default
        }
        const values = {
            target: !cmd.targets ? '' : this.targetsToParameters(cmd.targets, cfg.valuesAsNonArray, cfg.singleQuotedTargets),
            value: valueToRender,
            location: cmd.location,
            comment: cmd.comment,
            modifier: cmd.modifier,
            options: cmd.options,
        };
        const tabs = TABULATION.repeat(this.withinCount());
        const template = tabs + cfg.template + COMMENT_TEMPLATE;
        const rendered = (0, mustache_1.render)(template, values);
        result.push(rendered);
        // Switch with multiple frames
        if ('switch' === cmd.action
            && (cmd.targetTypes || []).includes('frame')
            && ((cmd.targets || []).length > 1)) {
            // const value = cmd.targets.length - 1;
            // this.setWithinCount( value );
            // Set to 1 instead of increasing, since current
            // implementation will avoid a within inside a within.
            this.setWithinCount(1);
        }
        return result;
    }
    /**
     * Make a code comment with the data of a abstract test script command.
     *
     * @param cmd Abstract test script command
     */
    makeCommentWithCommand(cmd) {
        if (!cmd) {
            return '// COMMAND NOT ACCEPTED';
        }
        return '// COMMAND NOT ACCEPTED -> ' + this.serializeCommand(cmd);
    }
    serializeCommand(cmd) {
        if (!cmd) {
            return '';
        }
        let s = '';
        let count = 0;
        for (let prop in cmd) {
            let val = cmd[prop];
            if (undefined === val) {
                continue;
            }
            if (count > 0) {
                s += ', ';
            }
            s += `"${prop}": ` + JSON.stringify(val);
            ++count;
        }
        return s;
    }
    /**
     * Returns true whether the command configuration is compatible with the
     * given abstract test script command.
     *
     * @param cfg Command configuration
     * @param cmd Abstract test script command
     */
    areCompatible(cfg, cmd) {
        if (cfg.action !== cmd.action) {
            return false;
        }
        function isNumber(x) {
            return 'number' === typeof x || !isNaN(parseInt(x));
        }
        function sameTargetTypes(cfg, cmd) {
            if ('string' === typeof cfg.targetTypes) {
                return (cmd.targetTypes || []).indexOf(cfg.targetTypes) >= 0;
            }
            const cmdTypes = cmd.targetTypes || [];
            const cfgTypes = cfg.targetTypes || [];
            for (const configured of cfgTypes) {
                if (cmdTypes.indexOf(configured) < 0) {
                    return false;
                }
            }
            return true;
        }
        function includeOptions(from, into) {
            let targetOptions = into.options || [];
            for (let o of from.options || []) {
                if (targetOptions.indexOf(o) < 0) {
                    return false; // not found
                }
            }
            return true; // all options of cfg were found at cmd
        }
        function oneValueThenNumbers(cmd, numberCount, atLeast = false) {
            const valuesCount = numberCount + 1;
            if ((cmd.values || []).length !== valuesCount) {
                return false;
            }
            const totalNumbersInValues = cmd.values.filter(isNumber).length;
            if (atLeast && totalNumbersInValues < numberCount) {
                return false;
            }
            if (numberCount !== totalNumbersInValues) {
                return false;
            }
            let newArray = [];
            for (let i = 0; i < valuesCount; ++i) {
                if (isNumber(cmd.values[i])) {
                    newArray.push(Number(cmd.values[i]));
                }
                else {
                    newArray.unshift(cmd.values[i]);
                }
            }
            cmd.values = newArray;
            return true;
        }
        function oneValueThenOneNumber(cmd) {
            return oneValueThenNumbers(cmd, 1);
        }
        function oneValueThenTwoNumbers(cmd) {
            return oneValueThenNumbers(cmd, 2);
        }
        function oneValueThenThreeNumbers(cmd) {
            return oneValueThenNumbers(cmd, 3);
        }
        const valuesCount = (cmd.values || []).length;
        const targetsCount = (cmd.targets || []).length;
        switch (cfg.comp) {
            case CmdCmp.ONE_VALUE: {
                return 1 === valuesCount && !isNumber(cmd.values[0]);
            }
            case CmdCmp.SAME_TARGET_TYPE__ONE_VALUE: {
                return 1 === valuesCount &&
                    !isNumber(cmd.values[0]) &&
                    sameTargetTypes(cfg, cmd);
            }
            case CmdCmp.SAME_MODIFIER__SAME_TARGET_TYPE__ONE_VALUE: {
                return 1 === valuesCount &&
                    !isNumber(cmd.values[0]) &&
                    sameTargetTypes(cfg, cmd) &&
                    cfg.modifier === cmd.modifier;
            }
            case CmdCmp.SAME_MODIFIER__SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER: {
                return 1 === valuesCount &&
                    sameTargetTypes(cfg, cmd) &&
                    cfg.modifier === cmd.modifier;
            }
            case CmdCmp.SAME_OPTION__ONE_NUMBER: {
                const ok = 1 === valuesCount &&
                    isNumber(cmd.values[0]) &&
                    includeOptions(cfg, cmd);
                if (ok) {
                    cmd.values[0] = Number(cmd.values[0]);
                }
                return ok;
            }
            case CmdCmp.SAME_OPTION__ONE_VALUE: {
                return 1 === valuesCount &&
                    !isNumber(cmd.values[0]) &&
                    includeOptions(cfg, cmd);
            }
            case CmdCmp.SAME_MODIFIER__SAME_OPTION: {
                return includeOptions(cfg, cmd) &&
                    cfg.modifier === cmd.modifier;
            }
            case CmdCmp.SAME_MODIFIER__SAME_OPTION__ONE_VALUE: {
                return 1 === valuesCount &&
                    !isNumber(cmd.values[0]) &&
                    includeOptions(cfg, cmd) &&
                    cfg.modifier === cmd.modifier;
            }
            case CmdCmp.SAME_MODIFIER__SAME_OPTION__ONE_VALUE_OR_NUMBER: {
                return 1 === valuesCount &&
                    includeOptions(cfg, cmd) &&
                    cfg.modifier === cmd.modifier;
            }
            case CmdCmp.ONE_VALUE_OR_NUMBER__OR_ARRAY: ; // next
            case CmdCmp.ONE_VALUE__OR_ARRAY: {
                return valuesCount >= 1;
            }
            case CmdCmp.ONE_VALUE__ONE_NUMBER: {
                return oneValueThenOneNumber(cmd);
            }
            case CmdCmp.SAME_TARGET_TYPE__ONE_NUMBER: {
                return sameTargetTypes(cfg, cmd) && 1 == valuesCount && isNumber(cmd.values[0]);
            }
            case CmdCmp.SAME_TARGET_TYPE__ONE_VALUE__ONE_NUMBER: {
                return sameTargetTypes(cfg, cmd) && oneValueThenOneNumber(cmd);
            }
            case CmdCmp.SAME_OPTION__ONE_VALUE__ONE_NUMBER: {
                return includeOptions(cfg, cmd) && oneValueThenOneNumber(cmd);
            }
            case CmdCmp.SAME_MODIFIER__ONE_VALUE: {
                return 1 === valuesCount &&
                    !isNumber(cmd.values[0]) &&
                    cmd.modifier === cfg.modifier;
            }
            case CmdCmp.SAME_MODIFIER__ONE_VALUE_OR_NUMBER: {
                return 1 === valuesCount && cmd.modifier === cfg.modifier;
            }
            case CmdCmp.ONE_VALUE__TWO_NUMBERS: {
                return oneValueThenTwoNumbers(cmd);
            }
            case CmdCmp.SAME_OPTION__ONE_VALUE__ONE_NUMBER__ONE_TARGET: {
                return 1 === targetsCount &&
                    oneValueThenOneNumber(cmd) &&
                    includeOptions(cfg, cmd);
            }
            case CmdCmp.SAME_OPTION__ONE_VALUE__ONE_NUMBER__ONE_VALUE: {
                if (3 !== valuesCount) {
                    return false;
                }
                const numberIndex = cmd.values.findIndex(isNumber);
                if (numberIndex < 0) {
                    return false;
                }
                // Transform to number
                cmd.values[numberIndex] = Number(cmd.values[numberIndex]);
                // Guarantee order -> index 1 is where the number must be placed
                if (0 === numberIndex) {
                    cmd.values = [cmd.values[1], cmd.values[0], cmd.values[2]];
                }
                else if (2 == numberIndex) {
                    cmd.values = [cmd.values[0], cmd.values[2], cmd.values[1]];
                }
                return true;
            }
            case CmdCmp.SAME_OPTION__ONE_VALUE__TWO_NUMBERS: {
                return includeOptions(cfg, cmd) && oneValueThenTwoNumbers(cmd);
            }
            case CmdCmp.SAME_OPTION__ONE_VALUE_OR_NUMBER: {
                return 1 === valuesCount && includeOptions(cfg, cmd);
            }
            case CmdCmp.SAME_OPTION__ONE_VALUE_OR_NUMBER__ONE_NUMBER: {
                return oneValueThenNumbers(cmd, 1, true) && includeOptions(cfg, cmd);
            }
            case CmdCmp.ONE_VALUE__THREE_NUMBERS: {
                return oneValueThenThreeNumbers(cmd);
            }
            case CmdCmp.ONE_VALUE_OR_NUMBER: {
                return 1 === valuesCount;
            }
            case CmdCmp.ONE_NUMBER: {
                const ok = 1 === valuesCount && isNumber(cmd.values[0]);
                if (ok) {
                    cmd.values[0] = Number(cmd.values[0]);
                }
                return ok;
            }
            case CmdCmp.ONE_NUMBER__ONE_TARGET: {
                return 1 === targetsCount && 1 === valuesCount && isNumber(cmd.values[0]);
            }
            case CmdCmp.ONE_TARGET: return 1 === targetsCount;
            case CmdCmp.ONE_VALUE__ONE_TARGET: ; // next
            case CmdCmp.ONE_TARGET__ONE_VALUE: {
                return 1 === targetsCount && 1 === valuesCount && !isNumber(cmd.values[0]);
            }
            case CmdCmp.ONE_TARGET__ONE_NUMBER: {
                const ok = 1 === targetsCount &&
                    1 === valuesCount &&
                    isNumber(cmd.values[0]);
                if (ok) {
                    cmd.values[0] = Number(cmd.values[0]);
                }
                return ok;
            }
            case CmdCmp.ONE_VALUE_OR_NUMBER__ONE_NUMBER: {
                return oneValueThenNumbers(cmd, 1, true);
            }
            case CmdCmp.ONE_VALUE_OR_NUMBER__ONE_TARGET: ; // next
            case CmdCmp.ONE_TARGET__ONE_VALUE_OR_NUMBER: {
                return 1 === targetsCount && 1 === valuesCount;
            }
            case CmdCmp.ONE_TARGET__TWO_NUMBERS: {
                const ok = 1 === targetsCount &&
                    2 === valuesCount &&
                    isNumber(cmd.values[0]) &&
                    isNumber(cmd.values[1]);
                if (ok) {
                    cmd.values[0] = Number(cmd.values[0]);
                    cmd.values[1] = Number(cmd.values[1]);
                }
                return ok;
            }
            case CmdCmp.ONE_TARGET__THREE_NUMBERS: {
                const ok = 1 === targetsCount &&
                    3 === valuesCount &&
                    isNumber(cmd.values[0]) &&
                    isNumber(cmd.values[1]) &&
                    isNumber(cmd.values[2]);
                if (ok) {
                    cmd.values[0] = Number(cmd.values[0]);
                    cmd.values[1] = Number(cmd.values[1]);
                    cmd.values[2] = Number(cmd.values[2]);
                }
                return ok;
            }
            case CmdCmp.SAME_OPTION__ONE_TARGET__ONE_NUMBER: {
                const ok = 1 === targetsCount &&
                    1 === valuesCount &&
                    isNumber(cmd.values[0]) &&
                    includeOptions(cfg, cmd);
                if (ok) {
                    cmd.values[0] = Number(cmd.values[0]);
                }
                return ok;
            }
            case CmdCmp.SAME_TARGET_TYPE__ONE_TARGET__ONE_NUMBER: {
                const ok = 1 === targetsCount &&
                    1 === valuesCount &&
                    isNumber(cmd.values[0]) &&
                    sameTargetTypes(cfg, cmd);
                if (ok) {
                    cmd.values[0] = Number(cmd.values[0]);
                }
                return ok;
            }
            case CmdCmp.SAME_TARGET_TYPE__ONE_TARGET__ONE_NUMBER__ONE_VALUE: {
                let ok = 1 === targetsCount &&
                    2 === valuesCount &&
                    sameTargetTypes(cfg, cmd);
                if (!ok) {
                    return false;
                }
                ok = oneValueThenNumbers(cmd, 1, true);
                if (ok) {
                    cmd.values = [cmd.values[1], cmd.values[0]];
                }
                return ok;
            }
            case CmdCmp.SAME_TARGET_TYPE__ONE_TARGET__TWO_NUMBERS: {
                const ok = 1 === targetsCount &&
                    2 === valuesCount &&
                    isNumber(cmd.values[0]) &&
                    isNumber(cmd.values[1]) &&
                    sameTargetTypes(cfg, cmd);
                if (ok) {
                    cmd.values = [Number(cmd.values[0]), Number(cmd.values[1])];
                }
                return ok;
            }
            case CmdCmp.SAME_TARGET_TYPE__ONE_TARGET__ONE_VALUE_OR_NUMBER: {
                return 1 === targetsCount &&
                    1 === valuesCount &&
                    sameTargetTypes(cfg, cmd);
            }
            case CmdCmp.SAME_TARGET_TYPE__ONE_TARGET__ONE_VALUE__ONE_NUMBER: {
                const ok = 1 === targetsCount &&
                    2 === valuesCount &&
                    sameTargetTypes(cfg, cmd);
                if (!ok) {
                    return false;
                }
                return oneValueThenNumbers(cmd, 1, true);
            }
            case CmdCmp.SAME_TARGET_TYPE__MANY_TARGETS: {
                return targetsCount > 1
                    && sameTargetTypes(cfg, cmd);
            }
            case CmdCmp.SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER: {
                return 1 === valuesCount &&
                    sameTargetTypes(cfg, cmd);
            }
            case CmdCmp.SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER__ONE_NUMBER: {
                return oneValueThenNumbers(cmd, 1, true) &&
                    sameTargetTypes(cfg, cmd);
            }
            case CmdCmp.SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER__ONE_NUMBER__ONE_TARGET: {
                return 1 === targetsCount &&
                    oneValueThenNumbers(cmd, 1, true) &&
                    sameTargetTypes(cfg, cmd);
            }
            case CmdCmp.SAME_OPTION__ONE_TARGET__TWO_NUMBERS: {
                const ok = 1 === targetsCount &&
                    2 === valuesCount &&
                    isNumber(cmd.values[0]) &&
                    isNumber(cmd.values[1]) &&
                    includeOptions(cfg, cmd);
                if (ok) {
                    cmd.values[0] = Number(cmd.values[0]);
                    cmd.values[1] = Number(cmd.values[1]);
                }
                return ok;
            }
            case CmdCmp.SAME_OPTION__ONE_TARGET__ONE_VALUE: {
                return 1 === targetsCount &&
                    1 === valuesCount &&
                    !isNumber(cmd.values[0]) &&
                    includeOptions(cfg, cmd);
            }
            case CmdCmp.SAME_OPTION__ONE_TARGET__ONE_VALUE_OR_NUMBER: {
                return 1 === targetsCount &&
                    1 === valuesCount &&
                    includeOptions(cfg, cmd);
            }
            case CmdCmp.SAME_OPTION__ONE_TARGET__ONE_VALUE_OR_NUMBER__ONE_NUMBER: {
                const ok = 1 === targetsCount &&
                    2 === valuesCount &&
                    includeOptions(cfg, cmd);
                if (!ok) {
                    return false;
                }
                return oneValueThenNumbers(cmd, 1, true);
            }
            case CmdCmp.SAME_OPTION__ONE_TARGET__ONE_VALUE__ONE_NUMBER: {
                return 1 === targetsCount &&
                    includeOptions(cfg, cmd) &&
                    oneValueThenOneNumber(cmd);
            }
            case CmdCmp.SAME_OPTION__MANY_TARGETS: {
                return targetsCount > 1 &&
                    includeOptions(cfg, cmd);
            }
            case CmdCmp.SAME_OPTION__SAME_TARGET_TYPE: {
                return includeOptions(cfg, cmd) &&
                    sameTargetTypes(cfg, cmd);
            }
            case CmdCmp.SAME_OPTION__SAME_TARGET_TYPE__ONE_NUMBER: {
                const ok = 1 === valuesCount &&
                    isNumber(cmd.values[0]) &&
                    includeOptions(cfg, cmd) &&
                    sameTargetTypes(cfg, cmd);
                if (ok) {
                    cmd.values[0] = Number(cmd.values[0]);
                }
                return ok;
            }
            case CmdCmp.SAME_OPTION__SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER: {
                return 1 === valuesCount &&
                    includeOptions(cfg, cmd) &&
                    sameTargetTypes(cfg, cmd);
            }
            case CmdCmp.SAME_OPTION__SAME_TARGET_TYPE__ONE_VALUE_OR_NUMBER__ONE_NUMBER: {
                return oneValueThenNumbers(cmd, 1, true) &&
                    includeOptions(cfg, cmd) &&
                    sameTargetTypes(cfg, cmd);
            }
            case CmdCmp.SAME_OPTION__SAME_TARGET_TYPE__ONE_TARGET: {
                return 1 === targetsCount &&
                    includeOptions(cfg, cmd) &&
                    sameTargetTypes(cfg, cmd);
            }
            case CmdCmp.SAME_OPTION__SAME_TARGET_TYPE__ONE_TARGET__ONE_NUMBER: {
                return 1 === targetsCount &&
                    1 === valuesCount &&
                    isNumber(cmd.values[0]) &&
                    includeOptions(cfg, cmd) &&
                    sameTargetTypes(cfg, cmd);
            }
            case CmdCmp.SAME_TARGET_TYPE__ONE_TARGET: {
                return 1 === targetsCount && sameTargetTypes(cfg, cmd);
            }
            case CmdCmp.SAME_MODIFIER__SAME_OPTION__ONE_TARGET: {
                return 1 === targetsCount &&
                    includeOptions(cfg, cmd) &&
                    cfg.modifier === cmd.modifier;
            }
            case CmdCmp.SAME_MODIFIER__SAME_OPTION__SAME_TARGET_TYPE__ONE_TARGET: {
                return 1 === targetsCount &&
                    sameTargetTypes(cfg, cmd) &&
                    includeOptions(cfg, cmd) &&
                    cfg.modifier === cmd.modifier;
            }
            case CmdCmp.SAME_MODIFIER__SAME_OPTION__ONE_TARGET__ONE_VALUE: {
                return 1 === targetsCount &&
                    1 === valuesCount &&
                    !isNumber(cmd.values[0]) &&
                    includeOptions(cfg, cmd) &&
                    cfg.modifier === cmd.modifier;
            }
            case CmdCmp.SAME_MODIFIER__SAME_OPTION__ONE_TARGET__ONE_VALUE_OR_NUMBER: {
                return 1 === targetsCount &&
                    1 === valuesCount &&
                    includeOptions(cfg, cmd) &&
                    cfg.modifier === cmd.modifier;
            }
            case CmdCmp.SAME_MODIFIER__SAME_OPTION__ONE_TARGET__TWO_VALUES: {
                return 1 === targetsCount &&
                    2 === valuesCount &&
                    includeOptions(cfg, cmd) &&
                    cfg.modifier === cmd.modifier;
            }
            case CmdCmp.SAME_MODIFIER__SAME_TARGET_TYPE__ONE_TARGET__ONE_VALUE: {
                return 1 === targetsCount &&
                    1 === valuesCount &&
                    !isNumber(cmd.values[0]) &&
                    sameTargetTypes(cfg, cmd) &&
                    cfg.modifier === cmd.modifier;
            }
            case CmdCmp.SAME_MODIFIER__SAME_TARGET_TYPE__ONE_TARGET__ONE_VALUE_OR_NUMBER: {
                return 1 === targetsCount &&
                    1 === valuesCount &&
                    sameTargetTypes(cfg, cmd) &&
                    cfg.modifier === cmd.modifier;
            }
            case CmdCmp.SAME_OPTION__ONE_TARGET: {
                return 1 === targetsCount && includeOptions(cfg, cmd);
            }
            case CmdCmp.SAME_MODIFIER__ONE_TARGET: {
                return 1 === targetsCount && cfg.modifier === cmd.modifier;
            }
            case CmdCmp.SAME_TARGET_TYPE: {
                return 0 === targetsCount && 0 === valuesCount && sameTargetTypes(cfg, cmd);
            }
            case CmdCmp.SAME_OPTION: {
                return 0 === targetsCount && 0 === valuesCount && includeOptions(cfg, cmd);
            }
            case CmdCmp.TWO_TARGETS: {
                return 2 === targetsCount;
            }
            case CmdCmp.TWO_VALUES_SAME_OPTION: {
                return 2 == valuesCount &&
                    !isNumber(cmd.values[0]) &&
                    !isNumber(cmd.values[1]) &&
                    includeOptions(cfg, cmd);
            }
            case CmdCmp.TWO_NUMBERS: {
                let ok = 2 == valuesCount &&
                    isNumber(cmd.values[0]) &&
                    isNumber(cmd.values[1]);
                if (ok) {
                    cmd.values[0] = Number(cmd.values[0]);
                    cmd.values[1] = Number(cmd.values[1]);
                }
                return ok;
            }
            case CmdCmp.TWO_NUMBERS_SAME_OPTION: {
                let ok = 2 == valuesCount &&
                    isNumber(cmd.values[0]) &&
                    isNumber(cmd.values[1]) &&
                    includeOptions(cfg, cmd);
                if (ok) {
                    cmd.values[0] = Number(cmd.values[0]);
                    cmd.values[1] = Number(cmd.values[1]);
                }
                return ok;
            }
            case CmdCmp.TWO_NUMBERS_SAME_TARGET_TYPE: {
                let ok = 2 == valuesCount &&
                    isNumber(cmd.values[0]) &&
                    isNumber(cmd.values[1]) &&
                    sameTargetTypes(cfg, cmd);
                if (ok) {
                    cmd.values[0] = Number(cmd.values[0]);
                    cmd.values[1] = Number(cmd.values[1]);
                }
                return ok;
            }
        }
        return false;
    }
    /**
     * Convert targets to function parameters.
     *
     * @param targets Targets to convert, usually UI literals.
     * @param singleQuotedTargets Whether the targets should be wrapped with single quotes.
     */
    targetsToParameters(targets, valueAsNonArrayWhenGreaterThanOne, singleQuotedTargets) {
        if (0 === targets.length) {
            return '';
        }
        const areStrings = 'string' === typeof targets[0];
        if (areStrings) {
            let strTargets = targets;
            if (1 === targets.length) {
                return this.convertSingleTarget(strTargets[0], singleQuotedTargets);
            }
            const joint = strTargets
                .map(v => this.convertSingleTarget(v, singleQuotedTargets))
                .join(', ');
            if (!valueAsNonArrayWhenGreaterThanOne) {
                return '[' + joint + ']';
            }
            return joint;
        }
        function valueReplacer(key, value) {
            if (typeof value === 'string' && value.charAt(0) === '@') {
                return { name: value.substr(1) };
            }
            return value;
        }
        const content = JSON.stringify(targets, valueReplacer);
        // remove [ and ]
        return content.substring(1, content.length - 1);
    }
    convertSingleTarget(target, singleQuotedTargets) {
        const t = !singleQuotedTargets
            ? this.escapeDoubleQuotes(target)
            : this.escapeSingleQuotes(target);
        return !singleQuotedTargets
            ? t.charAt(0) === '@' ? `{name: "${t.substr(1)}"}` : `"${t}"`
            : t.charAt(0) === '@' ? `{name: '${t.substr(1)}'}` : `'${t}'`;
    }
    /**
     * Convert values to function parameters.
     *
     * @param values Values to convert.
     * @param valueAsNonArrayWhenGreaterThanOne Whether wants to convert an
     *      array to single values when its size is greater than one.
     * @param singleQuotedValues Whether is desired to use single quotes.
     */
    valuesToParameters(values, valueAsNonArrayWhenGreaterThanOne = false, singleQuotedValues = false) {
        if (0 === values.length) {
            return '';
        }
        if (1 === values.length) {
            return this.convertSingleValue(values[0], singleQuotedValues);
        }
        const joint = values
            .map(v => this.convertSingleValue(v, singleQuotedValues))
            .join(', ');
        if (!valueAsNonArrayWhenGreaterThanOne) {
            return '[' + joint + ']';
        }
        return joint;
    }
    convertSingleValue(value, singleQuotedValues = false) {
        if (typeof value === 'string') {
            const v = singleQuotedValues
                ? this.escapeSingleQuotes(value)
                : this.escapeDoubleQuotes(value);
            return singleQuotedValues ? `'${v}'` : `"${v}"`;
        }
        return value;
    }
    escapeDoubleQuotes(value) {
        return value.replace(/[^\\](")/g, (p1) => {
            return p1.substr(0, 1) + '\\"';
        });
    }
    escapeSingleQuotes(value) {
        return value.replace(/[^\\](')/g, (p1) => {
            return p1.substr(0, 1) + "\\'";
        });
    }
}
exports.CommandMapper = CommandMapper;
