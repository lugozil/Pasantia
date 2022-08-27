"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const CONFIG_FILE_NAMES = ['extension.config.js', 'extension.config.mjs', 'extension.config.cjs'];
// This is needed to work around Typescript always transpiling import() to require() for CommonJS targets.
const _import = new Function('url', 'return import(url)');
async function loadConfig() {
    for (const fileName of CONFIG_FILE_NAMES) {
        if (await fs_extra_1.default.pathExists(fileName)) {
            const configFile = await _import(path_1.default.relative(__dirname, path_1.default.join(process.cwd(), fileName)).split(path_1.default.sep).join(path_1.default.posix.sep));
            return configFile.default;
        }
    }
    return {};
}
exports.default = loadConfig;
