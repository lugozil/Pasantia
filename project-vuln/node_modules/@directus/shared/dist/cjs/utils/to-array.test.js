"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const to_array_1 = require("./to-array");
describe('toArray', () => {
    it('takes in a string and returns an array', () => {
        expect((0, to_array_1.toArray)('1,2,3,4,5')).toStrictEqual(['1', '2', '3', '4', '5']);
    });
    it('when passed an array returns the array', () => {
        expect((0, to_array_1.toArray)(['1', '2', '3', '4', '5'])).toStrictEqual(['1', '2', '3', '4', '5']);
    });
});
