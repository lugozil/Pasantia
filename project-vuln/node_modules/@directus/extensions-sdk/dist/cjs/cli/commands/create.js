"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const execa_1 = __importDefault(require("execa"));
const ora_1 = __importDefault(require("ora"));
const constants_1 = require("@directus/shared/constants");
const utils_1 = require("@directus/shared/utils");
const logger_1 = __importDefault(require("../utils/logger"));
const languages_1 = require("../utils/languages");
const rename_map_1 = __importDefault(require("../utils/rename-map"));
const get_package_version_1 = __importDefault(require("../utils/get-package-version"));
const pkg = require('../../../../package.json');
const TEMPLATE_PATH = path_1.default.resolve(__dirname, '../../../../templates');
async function create(type, name, options) {
    const targetPath = path_1.default.resolve(name);
    if (!(0, utils_1.isExtension)(type)) {
        (0, logger_1.default)(`Extension type ${chalk_1.default.bold(type)} does not exist. Available extension types: ${constants_1.EXTENSION_TYPES.map((t) => chalk_1.default.bold.magenta(t)).join(', ')}.`, 'error');
        process.exit(1);
    }
    if (await fs_extra_1.default.pathExists(targetPath)) {
        const info = await fs_extra_1.default.stat(targetPath);
        if (!info.isDirectory()) {
            (0, logger_1.default)(`Destination ${chalk_1.default.bold(name)} already exists and is not a directory.`, 'error');
            process.exit(1);
        }
        const files = await fs_extra_1.default.readdir(targetPath);
        if (files.length > 0) {
            (0, logger_1.default)(`Destination ${chalk_1.default.bold(name)} already exists and is not empty.`, 'error');
            process.exit(1);
        }
    }
    if (!(0, languages_1.isLanguage)(options.language)) {
        (0, logger_1.default)(`Language ${chalk_1.default.bold(options.language)} is not supported. Available languages: ${constants_1.EXTENSION_LANGUAGES.map((t) => chalk_1.default.bold.magenta(t)).join(', ')}.`, 'error');
        process.exit(1);
    }
    const spinner = (0, ora_1.default)(`Scaffolding Directus extension...`).start();
    await fs_extra_1.default.ensureDir(targetPath);
    await fs_extra_1.default.copy(path_1.default.join(TEMPLATE_PATH, 'common', options.language), targetPath);
    await fs_extra_1.default.copy(path_1.default.join(TEMPLATE_PATH, type, options.language), targetPath);
    await (0, rename_map_1.default)(targetPath, (name) => (name.startsWith('_') ? `.${name.substring(1)}` : null));
    const packageManifest = {
        name: `directus-extension-${name}`,
        version: '1.0.0',
        keywords: ['directus', 'directus-extension', `directus-custom-${type}`],
        [constants_1.EXTENSION_PKG_KEY]: {
            type,
            path: 'dist/index.js',
            source: `src/index.${(0, languages_1.languageToShort)(options.language)}`,
            host: `^${pkg.version}`,
        },
        scripts: {
            build: 'directus-extension build',
        },
        devDependencies: await getPackageDeps(type, options.language),
    };
    await fs_extra_1.default.writeJSON(path_1.default.join(targetPath, 'package.json'), packageManifest, { spaces: '\t' });
    await (0, execa_1.default)('npm', ['install'], { cwd: targetPath });
    spinner.succeed(chalk_1.default.bold('Done'));
    (0, logger_1.default)(`
Your ${type} extension has been created at ${chalk_1.default.green(targetPath)}

Build your extension by running:
  ${chalk_1.default.blue('cd')} ${name}
  ${chalk_1.default.blue('npm run')} build
	`);
}
exports.default = create;
async function getPackageDeps(type, language) {
    if ((0, utils_1.isAppExtension)(type)) {
        return {
            '@directus/extensions-sdk': pkg.version,
            ...(language === 'typescript'
                ? {
                    typescript: `^${await (0, get_package_version_1.default)('typescript')}`,
                }
                : {}),
            vue: `^${await (0, get_package_version_1.default)('vue', 'next')}`,
        };
    }
    else {
        return {
            '@directus/extensions-sdk': pkg.version,
            ...(language === 'typescript'
                ? {
                    '@types/node': `^${await (0, get_package_version_1.default)('@types/node')}`,
                    typescript: `^${await (0, get_package_version_1.default)('typescript')}`,
                }
                : {}),
        };
    }
}
