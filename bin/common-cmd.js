var project = require('../common.js'),
    program = require('commander');

program
    .version(project.version)
    .description(project.description)
    .option('-v, --verbose', 'be verbose');

module.exports = program;