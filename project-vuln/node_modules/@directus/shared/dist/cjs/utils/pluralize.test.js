"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pluralize_1 = require("./pluralize");
describe('pluralize', () => {
    it('adds an s to the end of the string', () => {
        expect((0, pluralize_1.pluralize)('test')).toBe('tests');
    });
    it('removes an s to the end of the string', () => {
        expect((0, pluralize_1.depluralize)('tests')).toBe('test');
    });
});
