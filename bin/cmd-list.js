#!/usr/bin/env node
var program = require('./common-cmd.js')
    listPackages = require('./functions.js');

/*
 * List command
 */
program
    .option('-f, --force', 'force installation')
    .parse(process.argv);

/*
 * Call listPackages function
 */
listPackages(program.args);

