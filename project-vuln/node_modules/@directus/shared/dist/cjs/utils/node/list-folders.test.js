"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const list_folders_1 = require("./list-folders");
const tmp_1 = require("tmp");
describe('', () => {
    let rootDir;
    let childDir;
    beforeEach(() => {
        rootDir = (0, tmp_1.dirSync)({ unsafeCleanup: true, tmpdir: './' });
        childDir = (0, tmp_1.dirSync)({ tmpdir: rootDir.name });
    });
    afterEach(() => {
        rootDir.removeCallback();
    });
    it('returns all the subdirectories of the current directory', async () => {
        const childPath = childDir.name.split('/');
        expect(await (0, list_folders_1.listFolders)(rootDir.name)).toStrictEqual([childPath[(childPath === null || childPath === void 0 ? void 0 : childPath.length) - 1]]);
    });
});
