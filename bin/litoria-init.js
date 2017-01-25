#!/usr/bin/env node
let program = require('commander');
let chalk = require('chalk');
let $ = require('../lib/litoria.js');

/*
 * Generate command
 */
program
    .description('create a new litoria asciidoctor project')
    .usage('litoria <init> [options]')
    .option('-f, --force', 'force to use an existing folder')
    .option('-c, --category [type]', 'category of project to be created [simple], management, lab, slideshow', 'simple')
    .parse(process.argv);

/*
 * Call function responsible to convert the Asciidoc file(s) to HTML
 */
if ($.isEmpty(program.args)) {
  console.log(chalk.red('No project direcrory path has been provided.'));
  process.exit(0);
} else {
  $.initProject(program.category, program.force, program.args);
}
