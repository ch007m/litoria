#!/usr/bin/env node
var program = require('./common-cmd.js'),
    $ = require('./functions.js');

/*
 * List command
 */
program
    .option('-f, --force', 'force installation')
    .parse(process.argv);

/*
 * Call listPackages function
 */
$.listPackages(program.args,program);
$.listDirectories(program.args, program);

