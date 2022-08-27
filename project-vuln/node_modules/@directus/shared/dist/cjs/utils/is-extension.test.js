"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_extension_1 = require("./is-extension");
describe('is extension type', () => {
    it('returns true when passed a valid extension_type', () => {
        expect((0, is_extension_1.isExtension)('interface')).toBe(true);
    });
    it('returns false when passed an invalid extension_type', () => {
        expect((0, is_extension_1.isExtension)('not_extension_type')).toBe(false);
    });
    it('returns true when passed a valid app_extension_type', () => {
        expect((0, is_extension_1.isAppExtension)('interface')).toBe(true);
    });
    it('returns false when passed an invalid app_extension_type', () => {
        expect((0, is_extension_1.isAppExtension)('not_extension_type')).toBe(false);
    });
    it('returns true when passed a valid api_extension_type', () => {
        expect((0, is_extension_1.isApiExtension)('hook')).toBe(true);
    });
    it('returns false when passed an invalid api_extension_type', () => {
        expect((0, is_extension_1.isApiExtension)('not_extension_type')).toBe(false);
    });
    it('returns true when passed a valid extension_package_type', () => {
        expect((0, is_extension_1.isExtensionPackage)('pack')).toBe(true);
    });
    it('returns true when passed ain valid extension_package_type', () => {
        expect((0, is_extension_1.isExtensionPackage)('not_extension_type')).toBe(false);
    });
});
