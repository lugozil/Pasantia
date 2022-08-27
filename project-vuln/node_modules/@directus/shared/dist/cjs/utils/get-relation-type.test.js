"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_relation_type_1 = require("./get-relation-type");
describe('getRelationType', () => {
    it('returns m2o when relation is the same as collection and field', () => {
        const mockRelation = { collection: 'test', related_collection: 'test2', field: 'testField' };
        expect((0, get_relation_type_1.getRelationType)({ relation: mockRelation, collection: 'test', field: 'testField' })).toBe('m2o');
    });
    it('returns m2a when one_allowed_collections and one_collection_field are defined', () => {
        const mockRelation = {
            collection: 'test',
            related_collection: 'test2',
            field: 'testField',
            meta: {
                one_allowed_collections: ['test', 'test2'],
                one_collection_field: 'testField',
            },
        };
        expect((0, get_relation_type_1.getRelationType)({ relation: mockRelation, collection: 'test', field: 'testField' })).toBe('m2a');
    });
    it('returns o2m when related_collection is the same as collection and field', () => {
        const mockRelation = {
            collection: 'test',
            related_collection: 'test2',
            field: 'testField',
            meta: { one_field: 'testField' },
        };
        expect((0, get_relation_type_1.getRelationType)({ relation: mockRelation, collection: 'test2', field: 'testField' })).toBe('o2m');
    });
});
