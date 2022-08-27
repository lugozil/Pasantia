import { validatePayload } from './validate-payload';
describe('validatePayload', () => {
    it('returns an empty array when there are no errors', () => {
        const mockFilter = { _and: [{ field: { _eq: 'field' } }] };
        const mockPayload = { field: 'field' };
        expect(validatePayload(mockFilter, mockPayload)).toStrictEqual([]);
    });
    it('returns an array of 1 when there errors with an _and operator', () => {
        const mockFilter = { _and: [{ field: { _eq: 'field' } }] };
        const mockPayload = { field: 'test' };
        expect(validatePayload(mockFilter, mockPayload)).toHaveLength(1);
    });
    it('returns an array of 1 when there errors with an _or operator', () => {
        const mockFilter = { _or: [{ field: { _eq: 'field' } }] };
        const mockPayload = { field: 'test' };
        expect(validatePayload(mockFilter, mockPayload)).toHaveLength(1);
    });
});
