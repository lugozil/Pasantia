import { API_EXTENSION_TYPES, APP_EXTENSION_TYPES, EXTENSION_PACKAGE_TYPES, EXTENSION_TYPES } from '../constants';
export function isExtension(type) {
    return EXTENSION_TYPES.includes(type);
}
export function isAppExtension(type) {
    return APP_EXTENSION_TYPES.includes(type);
}
export function isApiExtension(type) {
    return API_EXTENSION_TYPES.includes(type);
}
export function isExtensionPackage(type) {
    return EXTENSION_PACKAGE_TYPES.includes(type);
}
