"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_simple_hash_1 = require("./get-simple-hash");
describe('getSimpleHash', () => {
    it('returns "364492" for string "test"', () => {
        expect((0, get_simple_hash_1.getSimpleHash)('test')).toBe('364492');
    });
    it('returns "28cb67ba" for stringified object "{ key: \'value\' }"', () => {
        expect((0, get_simple_hash_1.getSimpleHash)(JSON.stringify({ key: 'value' }))).toBe('28cb67ba');
    });
});
