#!/usr/bin/env node
var program = require('./common-cmd.js'),
    $ = require('./functions.js');

/*
 * Generate command
 */
program
    .description('Inline the css')
    .option('-f, --file', 'path of the html file to inline')
    .action(function () {
        /*
         * Call function responsible to convert the Asciidoc file(s) to HTML
         */
        if ($.isEmpty(program.args)) {
            console.log("No arguments have been passed to the command.");
            process.exit(0);
        } else {
            $.log.debug("File will be inlined");
            $.inline(program.args);
        }
    }).on('--help', function () {
       console.log('  Examples:');
       console.log();
       console.log('    $ cmd inline config.yaml');
       console.log();
    });

program.parse(process.argv);
