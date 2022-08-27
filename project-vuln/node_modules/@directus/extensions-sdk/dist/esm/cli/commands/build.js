import path from 'path';
import chalk from 'chalk';
import fse from 'fs-extra';
import ora from 'ora';
import { rollup, watch as rollupWatch, } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import styles from 'rollup-plugin-styles';
import vue from 'rollup-plugin-vue';
import { EXTENSION_PKG_KEY, EXTENSION_TYPES, APP_SHARED_DEPS, API_SHARED_DEPS } from '@directus/shared/constants';
import { isAppExtension, isExtension, validateExtensionManifest } from '@directus/shared/utils';
import log from '../utils/logger';
import { getLanguageFromPath, isLanguage } from '../utils/languages';
import loadConfig from '../utils/load-config';
export default async function build(options) {
    var _a, _b, _c;
    const packagePath = path.resolve('package.json');
    let extensionManifest = {};
    if (!(await fse.pathExists(packagePath))) {
        log(`Current directory is not a package.`, !options.force ? 'error' : 'warn');
        if (!options.force)
            process.exit(1);
    }
    else {
        extensionManifest = await fse.readJSON(packagePath);
        if (!validateExtensionManifest(extensionManifest)) {
            log(`Current directory is not a Directus extension.`, !options.force ? 'error' : 'warn');
            if (!options.force)
                process.exit(1);
        }
    }
    const type = options.type || ((_a = extensionManifest[EXTENSION_PKG_KEY]) === null || _a === void 0 ? void 0 : _a.type);
    const input = options.input || ((_b = extensionManifest[EXTENSION_PKG_KEY]) === null || _b === void 0 ? void 0 : _b.source);
    const output = options.output || ((_c = extensionManifest[EXTENSION_PKG_KEY]) === null || _c === void 0 ? void 0 : _c.path);
    if (!type || !isExtension(type)) {
        log(`Extension type ${chalk.bold(type)} does not exist. Available extension types: ${EXTENSION_TYPES.map((t) => chalk.bold.magenta(t)).join(', ')}.`, 'error');
        process.exit(1);
    }
    if (!input || !(await fse.pathExists(input)) || !(await fse.stat(input)).isFile()) {
        log(`Entrypoint ${chalk.bold(input)} does not exist.`, 'error');
        process.exit(1);
    }
    if (!output) {
        log(`Output file must be a valid path.`, 'error');
        process.exit(1);
    }
    const language = options.language || getLanguageFromPath(input);
    if (!isLanguage(language)) {
        log(`Language ${chalk.bold(language)} is not supported.`, 'error');
        process.exit(1);
    }
    const config = await loadConfig();
    const spinner = ora('Building Directus extension...').start();
    const rollupOptions = getRollupOptions(type, language, input, config.plugins, options);
    const rollupOutputOptions = getRollupOutputOptions(type, output, options);
    if (options.watch) {
        const watcher = rollupWatch({
            ...rollupOptions,
            output: rollupOutputOptions,
        });
        watcher.on('event', async (event) => {
            switch (event.code) {
                case 'ERROR': {
                    spinner.fail(chalk.bold('Failed'));
                    handleRollupError(event.error);
                    spinner.start(chalk.bold('Watching files for changes...'));
                    break;
                }
                case 'BUNDLE_END':
                    await event.result.close();
                    spinner.succeed(chalk.bold('Done'));
                    spinner.start(chalk.bold('Watching files for changes...'));
                    break;
                case 'BUNDLE_START':
                    spinner.text = 'Building Directus extension...';
                    break;
            }
        });
    }
    else {
        try {
            const bundle = await rollup(rollupOptions);
            await bundle.write(rollupOutputOptions);
            await bundle.close();
            spinner.succeed(chalk.bold('Done'));
        }
        catch (error) {
            spinner.fail(chalk.bold('Failed'));
            handleRollupError(error);
            process.exitCode = 1;
        }
    }
}
function getRollupOptions(type, language, input, plugins = [], options) {
    if (isAppExtension(type)) {
        return {
            input,
            external: APP_SHARED_DEPS,
            plugins: [
                vue({ preprocessStyles: true }),
                language === 'typescript' ? typescript({ check: false }) : null,
                styles(),
                ...plugins,
                nodeResolve({ browser: true }),
                commonjs({ esmExternals: true, sourceMap: options.sourcemap }),
                json(),
                replace({
                    values: {
                        'process.env.NODE_ENV': JSON.stringify('production'),
                    },
                    preventAssignment: true,
                }),
                options.minify ? terser() : null,
            ],
        };
    }
    else {
        return {
            input,
            external: API_SHARED_DEPS,
            plugins: [
                language === 'typescript' ? typescript({ check: false }) : null,
                ...plugins,
                nodeResolve(),
                commonjs({ sourceMap: options.sourcemap }),
                json(),
                replace({
                    values: {
                        'process.env.NODE_ENV': JSON.stringify('production'),
                    },
                    preventAssignment: true,
                }),
                options.minify ? terser() : null,
            ],
        };
    }
}
function getRollupOutputOptions(type, output, options) {
    if (isAppExtension(type)) {
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
    log('\n' + chalk.red.bold(`${pluginPrefix}${error.name}: ${error.message}`));
    if (error.url) {
        log(chalk.cyan(error.url), 'error');
    }
    if (error.loc) {
        log(`${(error.loc.file || error.id)} (${error.loc.line}:${error.loc.column})`);
    }
    else if (error.id) {
        log(error.id);
    }
    if (error.frame) {
        log(chalk.dim(error.frame));
    }
    if (error.stack) {
        log(chalk.dim(error.stack));
    }
}
