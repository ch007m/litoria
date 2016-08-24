#!/usr/bin/env node
var program = require('commander'),
    $       = require('../lib/litoria.js');

/*
 * Generate command
 */
program
    .description('generate html from the asciidoc file using html5 as backend')
    .usage('litoria <generate> [options]')
    .option('-b, --backend', 'backend - html5, docbook')
    .parse(process.argv);

/*
 * Call function responsible to convert the Asciidoc file(s) to HTML
 */
if ($.isEmpty(program.args)) {
    console.log("No config file has been passed to the command.");
    process.exit(0);
} else {
    $.convertToHtml(program.args);
}
