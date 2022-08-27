import { ensureExtensionDirs } from './ensure-extension-dirs';
import { EXTENSION_TYPES } from '../../constants/extensions';
import { dirSync } from 'tmp';
describe('ensureExtensionDirs', () => {
    let rootDir;
    beforeEach(() => {
        rootDir = dirSync({ unsafeCleanup: true });
    });
    afterEach(() => {
        rootDir.removeCallback();
    });
    const types = EXTENSION_TYPES;
    it('returns undefined if the folders exist', async () => {
        expect(await ensureExtensionDirs(rootDir.name, types)).toBe(undefined);
    });
    it('throws an error when a folder cant be opened', () => {
        expect(async () => {
            await ensureExtensionDirs('/.', types);
        }).rejects.toThrow(`Extension folder "/interfaces" couldn't be opened`);
    });
});
