#!/usr/bin/env node
var program = require('./common-cmd.js'),
    $ = require('./functions.js');

/*
 * Generate command
 */
program
    .option('-f, --file', 'path of the html file to inline')
    .parse(process.argv);

/*
 * Call function responsible to convert the Asciidoc file(s) to HTML
 */
$.inline(program.args);
