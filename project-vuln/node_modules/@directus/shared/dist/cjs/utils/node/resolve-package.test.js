"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resolve_package_1 = require("./resolve-package");
const tmp_1 = require("tmp");
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
describe('', () => {
    let rootDir;
    beforeEach(() => {
        rootDir = (0, tmp_1.dirSync)({ unsafeCleanup: true, tmpdir: './' });
        (0, fs_extra_1.ensureDirSync)(`${rootDir.name}/node_modules/`);
        (0, fs_extra_1.ensureDirSync)(`${rootDir.name}/node_modules/test-package/`);
        (0, fs_extra_1.writeJsonSync)(`${rootDir.name}/node_modules/test-package/package.json`, { name: 'test' });
    });
    afterEach(() => {
        rootDir.removeCallback();
    });
    it('the package to be found', () => {
        expect((0, resolve_package_1.resolvePackage)('test-package', rootDir.name)).toBe(path_1.default.resolve(`${rootDir.name}/node_modules/test-package`));
    });
});
