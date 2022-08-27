"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExtensionsEntry = void 0;
const path_1 = __importDefault(require("path"));
function generateExtensionsEntry(type, extensions) {
    const filteredExtensions = extensions.filter((extension) => extension.type === type);
    return `${filteredExtensions
        .map((extension, i) => `import e${i} from './${path_1.default
        .relative('.', path_1.default.resolve(extension.path, extension.entrypoint || ''))
        .split(path_1.default.sep)
        .join(path_1.default.posix.sep)}';\n`)
        .join('')}export default [${filteredExtensions.map((_, i) => `e${i}`).join(',')}];`;
}
exports.generateExtensionsEntry = generateExtensionsEntry;
