var project = require('../common.js'),
    program = require('commander');

/*
 * Commander common features
 */
program
    .version(project.version)
    .description(project.description)
    .option('-v, --verbose', 'be verbose');

module.exports = program;