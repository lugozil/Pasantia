"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_dynamic_variable_1 = require("./is-dynamic-variable");
const tests = [
    ['$NOW', true],
    ['$NOW(- 1 year)', true],
    ['test', false],
    ['$CUSTOM', false],
    ['$CURRENT_USER', true],
    ['$CURRENT_ROLE', true],
    ['$CURRENT_USER.role.name', true],
    ['$CURRENT_ROLE.users.id', true],
];
describe('is extension type', () => {
    for (const [value, result] of tests) {
        it(value, () => {
            expect((0, is_dynamic_variable_1.isDynamicVariable)(value)).toBe(result);
        });
    }
});
