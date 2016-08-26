#!/usr/bin/env node
var program = require('commander'),
    $       = require('../lib/litoria.js');

/*
 * Inline command
 */
program
    .description('Inline the css')
    .usage('litoria inline [options]')
    //.option('-f, --file', 'path of the html file to inline')
    .action(function () {
        if ($.isEmpty(program.args)) {
            console.log(chalk.red("No arguments have been passed to the command."));
            process.exit(0);
        } else {
            console.log("File will be inlined !");
            $.inline(program.args);
        }
    }).on('--help', function () {
       console.log('  Examples:');
       console.log();
       console.log('    $ litoria inline config.yaml');
       console.log();
    });

program.parse(process.argv);
