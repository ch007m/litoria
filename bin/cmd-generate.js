#!/usr/bin/env node
var program = require('commander'),
    $       = require('../lib/functions.js');

/*
 * Generate command
 */
program
    .description('generate html from the asciidoc file using html5 as backend')
    .usage('cmd generate [options]')
    .option('-b, --backend', 'backend - html5, docbook')
    .help()
    .parse(process.argv);

/*
 * Call function responsible to convert the Asciidoc file(s) to HTML
 */
if ($.isEmpty(program.args)) {
    console.log("No arguments have been passed to the command.");
    process.exit(0);
} else {
    $.convertToHtml(program.args);
}
