import { EXTENSION_PACKAGE_TYPES, EXTENSION_TYPES } from '../../constants/extensions';
import { getLocalExtensions, getPackageExtensions } from './get-extensions';
import { dirSync } from 'tmp';
import { ensureDirSync, writeJsonSync } from 'fs-extra';
describe('getPackageExtensions', () => {
    let rootPackageDir;
    let noPackageDir;
    beforeEach(() => {
        noPackageDir = dirSync({ prefix: './' });
        rootPackageDir = dirSync({ unsafeCleanup: true, tmpdir: './' });
    });
    afterEach(() => {
        noPackageDir.removeCallback();
        rootPackageDir.removeCallback();
    });
    it('throws an error when no package.json is found', async () => {
        const error = async () => await getPackageExtensions(noPackageDir.name, EXTENSION_PACKAGE_TYPES);
        expect(error).rejects.toThrow(`Current folder does not contain a package.json file`);
    });
    it('returns an array of extensions based on package.json', async () => {
        const childPackage = dirSync({ tmpdir: rootPackageDir.name });
        writeJsonSync(`${childPackage.name}/package.json`, {
            name: `${childPackage.name}`,
            dependencies: {
                'directus-extension-test': '0.1',
            },
        });
        ensureDirSync(`${childPackage.name}/directus-extension-test/`);
        writeJsonSync(`${childPackage.name}/directus-extension-test/package.json`, {
            name: 'test',
            version: '0.1',
            dependencies: {},
            'directus:extension': { type: 'pack', path: './', source: 'test', host: '^9.0.0' },
        });
        expect(await getPackageExtensions(childPackage.name, EXTENSION_PACKAGE_TYPES)).toStrictEqual([
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
        const errorPackage = dirSync({ unsafeCleanup: true, tmpdir: rootPackageDir.name });
        expect(getPackageExtensions(errorPackage.name, EXTENSION_PACKAGE_TYPES)).rejects.toThrowError(`Current folder does not contain a package.json file`);
    });
    it('returns an error when validateExtensionManifest fails', async () => {
        const typePackage = dirSync({ unsafeCleanup: true, tmpdir: rootPackageDir.name });
        writeJsonSync(`${typePackage.name}/package.json`, {
            name: `${typePackage.name}`,
            dependencies: {
                'directus-extension-type': '0.1',
            },
        });
        ensureDirSync(`${typePackage.name}/node_modules/directus-extension-type/`);
        writeJsonSync(`${typePackage.name}/node_modules/directus-extension-type/package.json`, {
            name: 'test',
            version: '0.1',
            dependencies: {},
            'directus:extension': { type: 'interface', path: './', source: 'test', host: '^9.0.0' },
        });
        expect(await getPackageExtensions(typePackage.name, EXTENSION_PACKAGE_TYPES)).toStrictEqual([
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
        rootLocalPackage = dirSync({ unsafeCleanup: true, tmpdir: './' });
    });
    afterEach(() => {
        rootLocalPackage.removeCallback();
    });
    it(`throws an error when the extension folder can not be opened`, async () => {
        expect(async () => {
            await getLocalExtensions(rootLocalPackage.name, EXTENSION_TYPES);
        }).rejects.toThrowError(`Extension folder "${rootLocalPackage.name}/interfaces" couldn't be opened`);
    });
    it(`returns an array of local extensions`, async () => {
        const extensionPackages = [];
        writeJsonSync(`${rootLocalPackage.name}/package.json`, {
            name: 'test',
            version: '0.1',
            dependencies: {},
        });
        EXTENSION_TYPES.forEach((type) => {
            ensureDirSync(`${rootLocalPackage.name}/${type}s/`);
            writeJsonSync(`${rootLocalPackage.name}/${type}s/package.json`, {
                name: `${rootLocalPackage.name}-${type}`,
                dependencies: {
                    'directus-extension-test': '0.1',
                },
            });
            ensureDirSync(`${rootLocalPackage.name}/${type}s/directus-extension-test`);
            extensionPackages.push({
                entrypoint: 'index.js',
                local: true,
                name: 'directus-extension-test',
                path: `${rootLocalPackage.name}/${type}s/directus-extension-test`,
                type: type,
            });
        });
        expect(await getLocalExtensions(rootLocalPackage.name, EXTENSION_TYPES)).toStrictEqual(extensionPackages);
    });
});
