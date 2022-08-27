"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generate_extensions_entry_1 = require("./generate-extensions-entry");
const extensions_1 = require("../../constants/extensions");
describe('generateExtensionsEntry', () => {
    const type = extensions_1.APP_EXTENSION_TYPES[4];
    it('returns an extension entrypoint exporting all extensions with a type that matches the provided type', () => {
        const mockExtension = [{ path: './extensions', name: 'mockExtension', type: 'panel', local: true }];
        expect((0, generate_extensions_entry_1.generateExtensionsEntry)(type, mockExtension)).toBe(`import e0 from './extensions';
export default [e0];`);
    });
    it('returns an empty extension entrypoint if there is no extension with the provided type', () => {
        const mockExtension = [{ path: './extensions', name: 'mockExtension', type: 'pack', local: true }];
        expect((0, generate_extensions_entry_1.generateExtensionsEntry)(type, mockExtension)).toBe(`export default [];`);
    });
});
