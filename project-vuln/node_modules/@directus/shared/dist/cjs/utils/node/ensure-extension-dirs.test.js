"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ensure_extension_dirs_1 = require("./ensure-extension-dirs");
const extensions_1 = require("../../constants/extensions");
const tmp_1 = require("tmp");
describe('ensureExtensionDirs', () => {
    let rootDir;
    beforeEach(() => {
        rootDir = (0, tmp_1.dirSync)({ unsafeCleanup: true });
    });
    afterEach(() => {
        rootDir.removeCallback();
    });
    const types = extensions_1.EXTENSION_TYPES;
    it('returns undefined if the folders exist', async () => {
        expect(await (0, ensure_extension_dirs_1.ensureExtensionDirs)(rootDir.name, types)).toBe(undefined);
    });
    it('throws an error when a folder cant be opened', () => {
        expect(async () => {
            await (0, ensure_extension_dirs_1.ensureExtensionDirs)('/.', types);
        }).rejects.toThrow(`Extension folder "/interfaces" couldn't be opened`);
    });
});
