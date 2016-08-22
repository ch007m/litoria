#!/usr/bin/env node
var program = require('./common-cmd.js'),
    $ = require('./functions.js');

/*
 * Generate command
 */
program
    .option('-b, --backend', 'backend - html5, docbook')
    .parse(process.argv);

/*
 * Call function responsible to convert the Asciidoc file(s) to HTML
 */
$.convertToHtml(program.args);
