#!/usr/bin/env node
var program = require('commander');
var chalk   = require("chalk");
var $       = require('../lib/litoria.js');

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
    console.log(chalk.red("No project direcrory path has been provided."));
    process.exit(0);
} else {
    $.initProject(program.force,program.args);
}
