#!/usr/bin/env node
var program = require('commander'),
    $       = require('../lib/litoria.js');

/*
 * Generate command
 */
program
    .description('Send html content to a sender')
    .usage('litoria send [options]')
    .option('-f, --file', 'path of the yaml config file')
    .action(function () {
        if ($.isEmpty(program.args)) {
            console.log(chalk.red("No arguments have been passed to the command."));
            process.exit(0);
        } else {
            $.send(program.args);
        }
    }).on('--help', function () {
       console.log('  Examples:');
       console.log();
       console.log('    $ litoria send config.yaml');
       console.log();
    });

program.parse(process.argv);
