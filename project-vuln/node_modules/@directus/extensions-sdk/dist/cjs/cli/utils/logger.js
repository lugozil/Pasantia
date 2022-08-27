"use strict";
/* eslint-disable no-console */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
function log(message, type) {
    if (type === 'info') {
        console.log(`${chalk_1.default.bold.gray('[Info]')} ${message}`);
    }
    else if (type === 'warn') {
        console.warn(`${chalk_1.default.bold.yellow('[Warn]')} ${message}`);
    }
    else if (type === 'error') {
        console.error(`${chalk_1.default.bold.red('[Error]')} ${message}`);
    }
    else {
        console.log(message);
    }
}
exports.default = log;
