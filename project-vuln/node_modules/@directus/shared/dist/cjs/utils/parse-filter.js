"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePreset = exports.parseFilter = void 0;
const constants_1 = require("../constants");
const to_array_1 = require("./to-array");
const adjust_date_1 = require("./adjust-date");
const is_dynamic_variable_1 = require("./is-dynamic-variable");
const lodash_1 = require("lodash");
const deep_map_1 = require("./deep-map");
function parseFilter(filter, accountability, context = {}) {
    var _a;
    if (filter === null || filter === undefined) {
        return null;
    }
    if (!(0, lodash_1.isObjectLike)(filter)) {
        return { _eq: parseFilterValue(filter, accountability, context) };
    }
    const filters = Object.entries(filter).map((entry) => parseFilterEntry(entry, accountability, context));
    if (filters.length === 0) {
        return {};
    }
    else if (filters.length === 1) {
        return (_a = filters[0]) !== null && _a !== void 0 ? _a : null;
    }
    else {
        return { _and: filters };
    }
}
exports.parseFilter = parseFilter;
function parsePreset(preset, accountability, context) {
    if (!preset)
        return preset;
    return (0, deep_map_1.deepMap)(preset, (value) => parseFilterValue(value, accountability, context));
}
exports.parsePreset = parsePreset;
function parseFilterEntry([key, value], accountability, context) {
    if (['_or', '_and'].includes(String(key))) {
        return { [key]: value.map((filter) => parseFilter(filter, accountability, context)) };
    }
    else if (['_in', '_nin', '_between', '_nbetween'].includes(String(key))) {
        return { [key]: (0, to_array_1.toArray)(value).flatMap((value) => parseFilterValue(value, accountability, context)) };
    }
    else if (String(key).startsWith('_')) {
        return { [key]: parseFilterValue(value, accountability, context) };
    }
    else {
        return { [key]: parseFilter(value, accountability, context) };
    }
}
function parseFilterValue(value, accountability, context) {
    if (value === 'true')
        return true;
    if (value === 'false')
        return false;
    if (value === 'null' || value === 'NULL')
        return null;
    if ((0, is_dynamic_variable_1.isDynamicVariable)(value))
        return parseDynamicVariable(value, accountability, context);
    return value;
}
function parseDynamicVariable(value, accountability, context) {
    var _a, _b, _c;
    if (value.startsWith('$NOW')) {
        if (value.includes('(') && value.includes(')')) {
            const adjustment = (_a = value.match(constants_1.REGEX_BETWEEN_PARENS)) === null || _a === void 0 ? void 0 : _a[1];
            if (!adjustment)
                return new Date();
            return (0, adjust_date_1.adjustDate)(new Date(), adjustment);
        }
        return new Date();
    }
    if (value.startsWith('$CURRENT_USER')) {
        if (value === '$CURRENT_USER')
            return (_b = accountability === null || accountability === void 0 ? void 0 : accountability.user) !== null && _b !== void 0 ? _b : null;
        return get(context, value, null);
    }
    if (value.startsWith('$CURRENT_ROLE')) {
        if (value === '$CURRENT_ROLE')
            return (_c = accountability === null || accountability === void 0 ? void 0 : accountability.role) !== null && _c !== void 0 ? _c : null;
        return get(context, value, null);
    }
}
function get(object, path, defaultValue) {
    const [key, ...follow] = path.split('.');
    const result = Array.isArray(object) ? object.map((entry) => entry[key]) : object === null || object === void 0 ? void 0 : object[key];
    if (follow.length > 0) {
        return get(result, follow.join('.'), defaultValue);
    }
    return result !== null && result !== void 0 ? result : defaultValue;
}
