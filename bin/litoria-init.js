#!/usr/bin/env node
var program = require('commander'),
    $       = require('../lib/litoria.js');

/*
 * Generate command
 */
program
    .description('create a new litoria asciidoctor project')
    .usage('litoria <init> [options]')
    .option('-f, --force', 'force to use an existing folder')
    .parse(process.argv);

/*
 * Call function responsible to convert the Asciidoc file(s) to HTML
 */
if ($.isEmpty(program.args)) {
    console.log("No config file has been passed to the command.");
    process.exit(0);
} else {
    $.initProject(program.force,program.args);
}
