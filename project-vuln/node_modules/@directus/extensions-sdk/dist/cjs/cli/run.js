"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const create_1 = __importDefault(require("./commands/create"));
const build_1 = __importDefault(require("./commands/build"));
const pkg = require('../../../package.json');
const program = new commander_1.Command();
program.name('directus-extension').usage('[command] [options]');
program.version(pkg.version, '-v, --version');
program
    .command('create')
    .arguments('<type> <name>')
    .description('Scaffold a new Directus extension')
    .option('-l, --language <language>', 'specify the language to use', 'javascript')
    .action(create_1.default);
program
    .command('build')
    .description('Bundle a Directus extension to a single entrypoint')
    .option('-t, --type <type>', 'overwrite the extension type read from package manifest')
    .option('-i, --input <file>', 'overwrite the entrypoint read from package manifest')
    .option('-o, --output <file>', 'overwrite the output file read from package manifest')
    .option('-l, --language <language>', 'overwrite the language to use')
    .option('-f, --force', 'ignore the package manifest')
    .option('-w, --watch', 'watch and rebuild on changes')
    .option('--no-minify', 'disable minification')
    .option('--sourcemap', 'include source maps in output')
    .action(build_1.default);
program.parse(process.argv);
