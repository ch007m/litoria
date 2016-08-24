var $       = require('../common.js');
var program = require('commander');
var chalk   = require('chalk');

module.exports = program;

/*
 * Commander common features
 */
program
    .version($.data.version)
    .description($.data.description)
    .usage("cmd <command> [options]")
    .arguments('<command> [options]');

    /*
     * Exit the process if no command and options are passed
     */
    if (!process.argv.slice(2).length) {
        program.outputHelp(chalk.bold.red);
        process.exit(9);
    }