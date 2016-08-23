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
if ($.isEmpty(program.args)) {
    console.log("No arguments have been passed to the command.");
    process.exit(0);
} else {
    $.inline(program.args);
}
