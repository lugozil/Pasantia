"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
async function renameMap(file, map) {
    const info = await fs_extra_1.default.stat(file);
    if (info.isFile()) {
        const newName = map(path_1.default.basename(file));
        if (newName !== null) {
            fs_extra_1.default.rename(file, path_1.default.join(path_1.default.dirname(file), newName));
        }
    }
    else {
        const subFiles = await fs_extra_1.default.readdir(file);
        for (const subFile of subFiles) {
            await renameMap(path_1.default.join(file, subFile), map);
        }
    }
}
exports.default = renameMap;
