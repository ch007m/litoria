var $ = require('../common.js');
var program = require('commander');

module.exports = program;

/*
 * Commander common features
 */
program
    .version($.data.version)
    .usage("<command> [options]")
    .arguments('<command> [options]')
    .description($.data.description);

    if (!process.argv.slice(2).length) {
        console.log($.makeRed("  2 arguments are required : <command> [options] !"));
        program.outputHelp($.makeRed);
        process.exit(9);
    }