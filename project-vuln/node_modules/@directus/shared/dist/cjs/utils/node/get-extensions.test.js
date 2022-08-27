"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extensions_1 = require("../../constants/extensions");
const get_extensions_1 = require("./get-extensions");
const tmp_1 = require("tmp");
const fs_extra_1 = require("fs-extra");
describe('getPackageExtensions', () => {
    let rootPackageDir;
    let noPackageDir;
    beforeEach(() => {
        noPackageDir = (0, tmp_1.dirSync)({ prefix: './' });
        rootPackageDir = (0, tmp_1.dirSync)({ unsafeCleanup: true, tmpdir: './' });
    });
    afterEach(() => {
        noPackageDir.removeCallback();
        rootPackageDir.removeCallback();
    });
    it('throws an error when no package.json is found', async () => {
        const error = async () => await (0, get_extensions_1.getPackageExtensions)(noPackageDir.name, extensions_1.EXTENSION_PACKAGE_TYPES);
        expect(error).rejects.toThrow(`Current folder does not contain a package.json file`);
    });
    it('returns an array of extensions based on package.json', async () => {
        const childPackage = (0, tmp_1.dirSync)({ tmpdir: rootPackageDir.name });
        (0, fs_extra_1.writeJsonSync)(`${childPackage.name}/package.json`, {
            name: `${childPackage.name}`,
            dependencies: {
                'directus-extension-test': '0.1',
            },
        });
        (0, fs_extra_1.ensureDirSync)(`${childPackage.name}/directus-extension-test/`);
        (0, fs_extra_1.writeJsonSync)(`${childPackage.name}/directus-extension-test/package.json`, {
            name: 'test',
            version: '0.1',
            dependencies: {},
            'directus:extension': { type: 'pack', path: './', source: 'test', host: '^9.0.0' },
        });
        expect(await (0, get_extensions_1.getPackageExtensions)(childPackage.name, extensions_1.EXTENSION_PACKAGE_TYPES)).toStrictEqual([
            {
                children: [],
                host: '^9.0.0',
                local: false,
                name: 'directus-extension-test',
                path: childPackage.name + '/directus-extension-test',
                type: 'pack',
                version: '0.1',
            },
        ]);
    });
    it('returns an error when validateExtensionManifest fails', async () => {
        const errorPackage = (0, tmp_1.dirSync)({ unsafeCleanup: true, tmpdir: rootPackageDir.name });
        expect((0, get_extensions_1.getPackageExtensions)(errorPackage.name, extensions_1.EXTENSION_PACKAGE_TYPES)).rejects.toThrowError(`Current folder does not contain a package.json file`);
    });
    it('returns an error when validateExtensionManifest fails', async () => {
        const typePackage = (0, tmp_1.dirSync)({ unsafeCleanup: true, tmpdir: rootPackageDir.name });
        (0, fs_extra_1.writeJsonSync)(`${typePackage.name}/package.json`, {
            name: `${typePackage.name}`,
            dependencies: {
                'directus-extension-type': '0.1',
            },
        });
        (0, fs_extra_1.ensureDirSync)(`${typePackage.name}/node_modules/directus-extension-type/`);
        (0, fs_extra_1.writeJsonSync)(`${typePackage.name}/node_modules/directus-extension-type/package.json`, {
            name: 'test',
            version: '0.1',
            dependencies: {},
            'directus:extension': { type: 'interface', path: './', source: 'test', host: '^9.0.0' },
        });
        expect(await (0, get_extensions_1.getPackageExtensions)(typePackage.name, extensions_1.EXTENSION_PACKAGE_TYPES)).toStrictEqual([
            {
                host: '^9.0.0',
                entrypoint: './',
                local: false,
                name: 'directus-extension-type',
                path: typePackage.name + '/node_modules/directus-extension-type',
                type: 'interface',
                version: '0.1',
            },
        ]);
    });
});
describe('getLocalExtensions', () => {
    let rootLocalPackage;
    beforeEach(() => {
        rootLocalPackage = (0, tmp_1.dirSync)({ unsafeCleanup: true, tmpdir: './' });
    });
    afterEach(() => {
        rootLocalPackage.removeCallback();
    });
    it(`throws an error when the extension folder can not be opened`, async () => {
        expect(async () => {
            await (0, get_extensions_1.getLocalExtensions)(rootLocalPackage.name, extensions_1.EXTENSION_TYPES);
        }).rejects.toThrowError(`Extension folder "${rootLocalPackage.name}/interfaces" couldn't be opened`);
    });
    it(`returns an array of local extensions`, async () => {
        const extensionPackages = [];
        (0, fs_extra_1.writeJsonSync)(`${rootLocalPackage.name}/package.json`, {
            name: 'test',
            version: '0.1',
            dependencies: {},
        });
        extensions_1.EXTENSION_TYPES.forEach((type) => {
            (0, fs_extra_1.ensureDirSync)(`${rootLocalPackage.name}/${type}s/`);
            (0, fs_extra_1.writeJsonSync)(`${rootLocalPackage.name}/${type}s/package.json`, {
                name: `${rootLocalPackage.name}-${type}`,
                dependencies: {
                    'directus-extension-test': '0.1',
                },
            });
            (0, fs_extra_1.ensureDirSync)(`${rootLocalPackage.name}/${type}s/directus-extension-test`);
            extensionPackages.push({
                entrypoint: 'index.js',
                local: true,
                name: 'directus-extension-test',
                path: `${rootLocalPackage.name}/${type}s/directus-extension-test`,
                type: type,
            });
        });
        expect(await (0, get_extensions_1.getLocalExtensions)(rootLocalPackage.name, extensions_1.EXTENSION_TYPES)).toStrictEqual(extensionPackages);
    });
});
