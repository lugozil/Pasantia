"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateExtensionManifest = void 0;
const constants_1 = require("../constants");
const is_extension_1 = require("./is-extension");
function validateExtensionManifest(extensionManifest) {
    if (extensionManifest.name === undefined || extensionManifest.version === undefined) {
        return false;
    }
    const extensionOptions = extensionManifest[constants_1.EXTENSION_PKG_KEY];
    if (extensionOptions === undefined) {
        return false;
    }
    if (extensionOptions.type === undefined) {
        return false;
    }
    if (!(0, is_extension_1.isExtensionPackage)(extensionOptions.type)) {
        return false;
    }
    if (extensionOptions.type !== 'pack') {
        if (extensionOptions.path === undefined ||
            extensionOptions.source === undefined ||
            extensionOptions.host === undefined) {
            return false;
        }
    }
    else {
        if (extensionOptions.host === undefined) {
            return false;
        }
    }
    return true;
}
exports.validateExtensionManifest = validateExtensionManifest;
