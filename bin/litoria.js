#!/usr/bin/env node
var program = require('commander');
var chalk   = require('chalk');
var $       = require('../lib/litoria');

/*
 * Common features
 */
program
    .version($.data.version)
    .description($.data.description)
    .usage('<command> [options]');

/*
 * Exit the process if no command and options are passed
 */
if (!process.argv.slice(2).length) {
    program
        .usage('litoria <command> [options]')
        .outputHelp(chalk.bold.red);
    process.exit(1);
}

/*
 * List of commands
 * They should be mapped to their file
 * Example : .command('generate') --> $prefix-generate.js
 * where $prefix corresponds to the name of the executable defined within the package.json file
 */
program
    .command('init', 'Create a new litoria asciidoctor project')
    .command('generate', 'Generate the HTML')
    .command('inline', 'Inline css of a HTML file')
    .command('send', 'Send html content to a sender')
    .parse(process.argv);