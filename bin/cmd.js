#!/usr/bin/env node
var program = require('./common-cmd.js');

/*
 * List of commands available
 */
program
    .command('generate', 'Generate the HTML')
    .parse(process.argv);