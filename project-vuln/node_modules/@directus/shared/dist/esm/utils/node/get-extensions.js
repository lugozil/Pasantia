import path from 'path';
import fse from 'fs-extra';
import { resolvePackage } from './resolve-package';
import { listFolders } from './list-folders';
import { EXTENSION_NAME_REGEX, EXTENSION_PKG_KEY } from '../../constants';
import { pluralize } from '../pluralize';
import { validateExtensionManifest } from '../validate-extension-manifest';
export async function getPackageExtensions(root, types) {
    var _a;
    let pkg;
    try {
        pkg = await fse.readJSON(path.resolve(root, 'package.json'));
    }
    catch {
        throw new Error('Current folder does not contain a package.json file');
    }
    const extensionNames = Object.keys((_a = pkg.dependencies) !== null && _a !== void 0 ? _a : {}).filter((dep) => EXTENSION_NAME_REGEX.test(dep));
    return listExtensionsChildren(extensionNames, root);
    async function listExtensionsChildren(extensionNames, root) {
        var _a;
        const extensions = [];
        for (const extensionName of extensionNames) {
            const extensionPath = resolvePackage(extensionName, root);
            const extensionManifest = await fse.readJSON(path.join(extensionPath, 'package.json'));
            if (!validateExtensionManifest(extensionManifest)) {
                throw new Error(`The extension manifest of "${extensionName}" is not valid.`);
            }
            if (types.includes(extensionManifest[EXTENSION_PKG_KEY].type)) {
                if (extensionManifest[EXTENSION_PKG_KEY].type === 'pack') {
                    const extensionChildren = Object.keys((_a = extensionManifest.dependencies) !== null && _a !== void 0 ? _a : {}).filter((dep) => EXTENSION_NAME_REGEX.test(dep));
                    const extension = {
                        path: extensionPath,
                        name: extensionName,
                        version: extensionManifest.version,
                        type: extensionManifest[EXTENSION_PKG_KEY].type,
                        host: extensionManifest[EXTENSION_PKG_KEY].host,
                        children: extensionChildren,
                        local: false,
                    };
                    extensions.push(extension);
                    extensions.push(...(await listExtensionsChildren(extension.children || [], extension.path)));
                }
                else {
                    extensions.push({
                        path: extensionPath,
                        name: extensionName,
                        version: extensionManifest.version,
                        type: extensionManifest[EXTENSION_PKG_KEY].type,
                        entrypoint: extensionManifest[EXTENSION_PKG_KEY].path,
                        host: extensionManifest[EXTENSION_PKG_KEY].host,
                        local: false,
                    });
                }
            }
        }
        return extensions;
    }
}
export async function getLocalExtensions(root, types) {
    const extensions = [];
    for (const extensionType of types) {
        const typeDir = pluralize(extensionType);
        const typePath = path.resolve(root, typeDir);
        try {
            const extensionNames = await listFolders(typePath);
            for (const extensionName of extensionNames) {
                const extensionPath = path.join(typePath, extensionName);
                extensions.push({
                    path: extensionPath,
                    name: extensionName,
                    type: extensionType,
                    entrypoint: 'index.js',
                    local: true,
                });
            }
        }
        catch {
            throw new Error(`Extension folder "${typePath}" couldn't be opened`);
        }
    }
    return extensions;
}
