"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalExtensions = exports.getPackageExtensions = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const resolve_package_1 = require("./resolve-package");
const list_folders_1 = require("./list-folders");
const constants_1 = require("../../constants");
const pluralize_1 = require("../pluralize");
const validate_extension_manifest_1 = require("../validate-extension-manifest");
async function getPackageExtensions(root, types) {
    var _a;
    let pkg;
    try {
        pkg = await fs_extra_1.default.readJSON(path_1.default.resolve(root, 'package.json'));
    }
    catch {
        throw new Error('Current folder does not contain a package.json file');
    }
    const extensionNames = Object.keys((_a = pkg.dependencies) !== null && _a !== void 0 ? _a : {}).filter((dep) => constants_1.EXTENSION_NAME_REGEX.test(dep));
    return listExtensionsChildren(extensionNames, root);
    async function listExtensionsChildren(extensionNames, root) {
        var _a;
        const extensions = [];
        for (const extensionName of extensionNames) {
            const extensionPath = (0, resolve_package_1.resolvePackage)(extensionName, root);
            const extensionManifest = await fs_extra_1.default.readJSON(path_1.default.join(extensionPath, 'package.json'));
            if (!(0, validate_extension_manifest_1.validateExtensionManifest)(extensionManifest)) {
                throw new Error(`The extension manifest of "${extensionName}" is not valid.`);
            }
            if (types.includes(extensionManifest[constants_1.EXTENSION_PKG_KEY].type)) {
                if (extensionManifest[constants_1.EXTENSION_PKG_KEY].type === 'pack') {
                    const extensionChildren = Object.keys((_a = extensionManifest.dependencies) !== null && _a !== void 0 ? _a : {}).filter((dep) => constants_1.EXTENSION_NAME_REGEX.test(dep));
                    const extension = {
                        path: extensionPath,
                        name: extensionName,
                        version: extensionManifest.version,
                        type: extensionManifest[constants_1.EXTENSION_PKG_KEY].type,
                        host: extensionManifest[constants_1.EXTENSION_PKG_KEY].host,
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
                        type: extensionManifest[constants_1.EXTENSION_PKG_KEY].type,
                        entrypoint: extensionManifest[constants_1.EXTENSION_PKG_KEY].path,
                        host: extensionManifest[constants_1.EXTENSION_PKG_KEY].host,
                        local: false,
                    });
                }
            }
        }
        return extensions;
    }
}
exports.getPackageExtensions = getPackageExtensions;
async function getLocalExtensions(root, types) {
    const extensions = [];
    for (const extensionType of types) {
        const typeDir = (0, pluralize_1.pluralize)(extensionType);
        const typePath = path_1.default.resolve(root, typeDir);
        try {
            const extensionNames = await (0, list_folders_1.listFolders)(typePath);
            for (const extensionName of extensionNames) {
                const extensionPath = path_1.default.join(typePath, extensionName);
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
exports.getLocalExtensions = getLocalExtensions;
