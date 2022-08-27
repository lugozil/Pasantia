"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_fields_from_template_1 = require("./get-fields-from-template");
describe('getFieldsFromTemplate', () => {
    it('returns an empty array when passed null', () => {
        expect((0, get_fields_from_template_1.getFieldsFromTemplate)(null)).toStrictEqual([]);
    });
    it('returns fields as an array of strings', () => {
        expect((0, get_fields_from_template_1.getFieldsFromTemplate)('{{ field }}')).toStrictEqual(['field']);
    });
});
