"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const move_in_array_1 = require("./move-in-array");
describe('moveInArray', () => {
    const testArray = [1, 2, 3, 4, 5, 6];
    it('returns the original array if the item is undefined', () => {
        expect((0, move_in_array_1.moveInArray)(testArray, 6, 2)).toStrictEqual(testArray);
    });
    it('moves the item to the right to the specified index', () => {
        expect((0, move_in_array_1.moveInArray)(testArray, 1, 2)).toStrictEqual([1, 3, 2, 4, 5, 6]);
    });
    it('moves the item to the left to the specified index', () => {
        expect((0, move_in_array_1.moveInArray)(testArray, 5, -3)).toStrictEqual([1, 2, 3, 6, 4, 5]);
    });
    it('returns the original array when passed the same toIndex and fromIndex', () => {
        expect((0, move_in_array_1.moveInArray)(testArray, 0, 0)).toStrictEqual(testArray);
    });
});
