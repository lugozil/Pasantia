"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_payload_1 = require("./validate-payload");
describe('validatePayload', () => {
    it('returns an empty array when there are no errors', () => {
        const mockFilter = { _and: [{ field: { _eq: 'field' } }] };
        const mockPayload = { field: 'field' };
        expect((0, validate_payload_1.validatePayload)(mockFilter, mockPayload)).toStrictEqual([]);
    });
    it('returns an array of 1 when there errors with an _and operator', () => {
        const mockFilter = { _and: [{ field: { _eq: 'field' } }] };
        const mockPayload = { field: 'test' };
        expect((0, validate_payload_1.validatePayload)(mockFilter, mockPayload)).toHaveLength(1);
    });
    it('returns an array of 1 when there errors with an _or operator', () => {
        const mockFilter = { _or: [{ field: { _eq: 'field' } }] };
        const mockPayload = { field: 'test' };
        expect((0, validate_payload_1.validatePayload)(mockFilter, mockPayload)).toHaveLength(1);
    });
});
