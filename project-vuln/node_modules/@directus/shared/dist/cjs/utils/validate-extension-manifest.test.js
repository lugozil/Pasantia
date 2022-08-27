"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_extension_manifest_1 = require("./validate-extension-manifest");
describe('', () => {
    it('returns false when passed item has no name or version', () => {
        expect((0, validate_extension_manifest_1.validateExtensionManifest)({})).toBe(false);
    });
    it('returns false when passed item has no EXTENSION_PKG_KEY', () => {
        const mockExtension = { name: 'test', version: '0.1' };
        expect((0, validate_extension_manifest_1.validateExtensionManifest)(mockExtension)).toBe(false);
    });
    it('returns false when passed item has no type', () => {
        const mockExtension = { name: 'test', version: '0.1', 'directus:extension': {} };
        expect((0, validate_extension_manifest_1.validateExtensionManifest)(mockExtension)).toBe(false);
    });
    it('returns false when passed item has an invalid type', () => {
        const mockExtension = {
            name: 'test',
            version: '0.1',
            'directus:extension': { type: 'not_extension_type' },
        };
        expect((0, validate_extension_manifest_1.validateExtensionManifest)(mockExtension)).toBe(false);
    });
    it('returns false when passed item has a type other than pack and has no path, source or host', () => {
        const mockExtension = {
            name: 'test',
            version: '0.1',
            'directus:extension': { type: 'interface' },
        };
        expect((0, validate_extension_manifest_1.validateExtensionManifest)(mockExtension)).toBe(false);
    });
    it('returns false when passed item has a type of pack and has no host', () => {
        const mockExtension = {
            name: 'test',
            version: '0.1',
            'directus:extension': { type: 'pack' },
        };
        expect((0, validate_extension_manifest_1.validateExtensionManifest)(mockExtension)).toBe(false);
    });
    it('returns true when passed a valid ExtensionManifestRaw with a type other than pack', () => {
        const mockExtension = {
            name: 'test',
            version: '0.1',
            'directus:extension': { type: 'interface', path: './', source: 'test', host: '^9.0.0' },
        };
        expect((0, validate_extension_manifest_1.validateExtensionManifest)(mockExtension)).toBe(true);
    });
    it('returns true when passed a valid ExtensionManifestRaw with a type of pack', () => {
        const mockExtension = {
            name: 'test',
            version: '0.1',
            'directus:extension': { type: 'pack', host: '^9.0.0' },
        };
        expect((0, validate_extension_manifest_1.validateExtensionManifest)(mockExtension)).toBe(true);
    });
});
