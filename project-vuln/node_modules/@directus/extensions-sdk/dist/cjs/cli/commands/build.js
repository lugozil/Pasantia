"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const ora_1 = __importDefault(require("ora"));
const rollup_1 = require("rollup");
const plugin_node_resolve_1 = require("@rollup/plugin-node-resolve");
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const plugin_json_1 = __importDefault(require("@rollup/plugin-json"));
const plugin_replace_1 = __importDefault(require("@rollup/plugin-replace"));
const rollup_plugin_typescript2_1 = __importDefault(require("rollup-plugin-typescript2"));
const rollup_plugin_terser_1 = require("rollup-plugin-terser");
const rollup_plugin_styles_1 = __importDefault(require("rollup-plugin-styles"));
const rollup_plugin_vue_1 = __importDefault(require("rollup-plugin-vue"));
const constants_1 = require("@directus/shared/constants");
const utils_1 = require("@directus/shared/utils");
const logger_1 = __importDefault(require("../utils/logger"));
const languages_1 = require("../utils/languages");
const load_config_1 = __importDefault(require("../utils/load-config"));
async function build(options) {
    var _a, _b, _c;
    const packagePath = path_1.default.resolve('package.json');
    let extensionManifest = {};
    if (!(await fs_extra_1.default.pathExists(packagePath))) {
        (0, logger_1.default)(`Current directory is not a package.`, !options.force ? 'error' : 'warn');
        if (!options.force)
            process.exit(1);
    }
    else {
        extensionManifest = await fs_extra_1.default.readJSON(packagePath);
        if (!(0, utils_1.validateExtensionManifest)(extensionManifest)) {
            (0, logger_1.default)(`Current directory is not a Directus extension.`, !options.force ? 'error' : 'warn');
            if (!options.force)
                process.exit(1);
        }
    }
    const type = options.type || ((_a = extensionManifest[constants_1.EXTENSION_PKG_KEY]) === null || _a === void 0 ? void 0 : _a.type);
    const input = options.input || ((_b = extensionManifest[constants_1.EXTENSION_PKG_KEY]) === null || _b === void 0 ? void 0 : _b.source);
    const output = options.output || ((_c = extensionManifest[constants_1.EXTENSION_PKG_KEY]) === null || _c === void 0 ? void 0 : _c.path);
    if (!type || !(0, utils_1.isExtension)(type)) {
        (0, logger_1.default)(`Extension type ${chalk_1.default.bold(type)} does not exist. Available extension types: ${constants_1.EXTENSION_TYPES.map((t) => chalk_1.default.bold.magenta(t)).join(', ')}.`, 'error');
        process.exit(1);
    }
    if (!input || !(await fs_extra_1.default.pathExists(input)) || !(await fs_extra_1.default.stat(input)).isFile()) {
        (0, logger_1.default)(`Entrypoint ${chalk_1.default.bold(input)} does not exist.`, 'error');
        process.exit(1);
    }
    if (!output) {
        (0, logger_1.default)(`Output file must be a valid path.`, 'error');
        process.exit(1);
    }
    const language = options.language || (0, languages_1.getLanguageFromPath)(input);
    if (!(0, languages_1.isLanguage)(language)) {
        (0, logger_1.default)(`Language ${chalk_1.default.bold(language)} is not supported.`, 'error');
        process.exit(1);
    }
    const config = await (0, load_config_1.default)();
    const spinner = (0, ora_1.default)('Building Directus extension...').start();
    const rollupOptions = getRollupOptions(type, language, input, config.plugins, options);
    const rollupOutputOptions = getRollupOutputOptions(type, output, options);
    if (options.watch) {
        const watcher = (0, rollup_1.watch)({
            ...rollupOptions,
            output: rollupOutputOptions,
        });
        watcher.on('event', async (event) => {
            switch (event.code) {
                case 'ERROR': {
                    spinner.fail(chalk_1.default.bold('Failed'));
                    handleRollupError(event.error);
                    spinner.start(chalk_1.default.bold('Watching files for changes...'));
                    break;
                }
                case 'BUNDLE_END':
                    await event.result.close();
                    spinner.succeed(chalk_1.default.bold('Done'));
                    spinner.start(chalk_1.default.bold('Watching files for changes...'));
                    break;
                case 'BUNDLE_START':
                    spinner.text = 'Building Directus extension...';
                    break;
            }
        });
    }
    else {
        try {
            const bundle = await (0, rollup_1.rollup)(rollupOptions);
            await bundle.write(rollupOutputOptions);
            await bundle.close();
            spinner.succeed(chalk_1.default.bold('Done'));
        }
        catch (error) {
            spinner.fail(chalk_1.default.bold('Failed'));
            handleRollupError(error);
            process.exitCode = 1;
        }
    }
}
exports.default = build;
function getRollupOptions(type, language, input, plugins = [], options) {
    if ((0, utils_1.isAppExtension)(type)) {
        return {
            input,
            external: constants_1.APP_SHARED_DEPS,
            plugins: [
                (0, rollup_plugin_vue_1.default)({ preprocessStyles: true }),
                language === 'typescript' ? (0, rollup_plugin_typescript2_1.default)({ check: false }) : null,
                (0, rollup_plugin_styles_1.default)(),
                ...plugins,
                (0, plugin_node_resolve_1.nodeResolve)({ browser: true }),
                (0, plugin_commonjs_1.default)({ esmExternals: true, sourceMap: options.sourcemap }),
                (0, plugin_json_1.default)(),
                (0, plugin_replace_1.default)({
                    values: {
                        'process.env.NODE_ENV': JSON.stringify('production'),
                    },
                    preventAssignment: true,
                }),
                options.minify ? (0, rollup_plugin_terser_1.terser)() : null,
            ],
        };
    }
    else {
        return {
            input,
            external: constants_1.API_SHARED_DEPS,
            plugins: [
                language === 'typescript' ? (0, rollup_plugin_typescript2_1.default)({ check: false }) : null,
                ...plugins,
                (0, plugin_node_resolve_1.nodeResolve)(),
                (0, plugin_commonjs_1.default)({ sourceMap: options.sourcemap }),
                (0, plugin_json_1.default)(),
                (0, plugin_replace_1.default)({
                    values: {
                        'process.env.NODE_ENV': JSON.stringify('production'),
                    },
                    preventAssignment: true,
                }),
                options.minify ? (0, rollup_plugin_terser_1.terser)() : null,
            ],
        };
    }
}
function getRollupOutputOptions(type, output, options) {
    if ((0, utils_1.isAppExtension)(type)) {
        return {
            file: output,
            format: 'es',
            inlineDynamicImports: true,
            sourcemap: options.sourcemap,
        };
    }
    else {
        return {
            file: output,
            format: 'cjs',
            exports: 'default',
            inlineDynamicImports: true,
            sourcemap: options.sourcemap,
        };
    }
}
function handleRollupError(error) {
    const pluginPrefix = error.plugin ? `(plugin ${error.plugin}) ` : '';
    (0, logger_1.default)('\n' + chalk_1.default.red.bold(`${pluginPrefix}${error.name}: ${error.message}`));
    if (error.url) {
        (0, logger_1.default)(chalk_1.default.cyan(error.url), 'error');
    }
    if (error.loc) {
        (0, logger_1.default)(`${(error.loc.file || error.id)} (${error.loc.line}:${error.loc.column})`);
    }
    else if (error.id) {
        (0, logger_1.default)(error.id);
    }
    if (error.frame) {
        (0, logger_1.default)(chalk_1.default.dim(error.frame));
    }
    if (error.stack) {
        (0, logger_1.default)(chalk_1.default.dim(error.stack));
    }
}
