"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExtensionPackage = exports.isApiExtension = exports.isAppExtension = exports.isExtension = void 0;
const constants_1 = require("../constants");
function isExtension(type) {
    return constants_1.EXTENSION_TYPES.includes(type);
}
exports.isExtension = isExtension;
function isAppExtension(type) {
    return constants_1.APP_EXTENSION_TYPES.includes(type);
}
exports.isAppExtension = isAppExtension;
function isApiExtension(type) {
    return constants_1.API_EXTENSION_TYPES.includes(type);
}
exports.isApiExtension = isApiExtension;
function isExtensionPackage(type) {
    return constants_1.EXTENSION_PACKAGE_TYPES.includes(type);
}
exports.isExtensionPackage = isExtensionPackage;
