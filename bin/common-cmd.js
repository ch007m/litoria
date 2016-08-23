var project = require('../common.js');
var program = require('commander');
var colors  = require('colors');

module.exports = program;

/*
 * Commander common features
 */
program
    .version(project.version)
    .description(project.description);

    if (!process.argv.slice(2).length) {
        program.outputHelp(make_red);
        process.exit(0);
    }

function make_red(txt) {
    return colors.red(txt); //display the help text in red on the console
}