import { listFolders } from './list-folders';
import { dirSync } from 'tmp';
describe('', () => {
    let rootDir;
    let childDir;
    beforeEach(() => {
        rootDir = dirSync({ unsafeCleanup: true, tmpdir: './' });
        childDir = dirSync({ tmpdir: rootDir.name });
    });
    afterEach(() => {
        rootDir.removeCallback();
    });
    it('returns all the subdirectories of the current directory', async () => {
        const childPath = childDir.name.split('/');
        expect(await listFolders(rootDir.name)).toStrictEqual([childPath[(childPath === null || childPath === void 0 ? void 0 : childPath.length) - 1]]);
    });
});
