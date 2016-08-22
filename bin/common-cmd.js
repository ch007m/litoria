var project = require('../common.js'),
    program = require('commander');

module.exports = program;

/*
 * Commander common features
 */
program
    .version(project.version)
    .description(project.description)
    .option('-v, --verbose', 'be verbose');