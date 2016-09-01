#!/usr/bin/env node
var program = require('commander');
var $       = require('../lib/litoria.js');
var Log     = require("../lib/log");

var log = new Log();

/*
 * Inline command
 */
program
    .description('Inline the css content of a file')
    .usage('litoria inline')
    .action(function () {
        if ($.isEmpty(program.args)) {
            log.error("No arguments have been passed to the command.");
            process.exit(0);
        } else {
            log.info("File will be inlined !");
            $.inline(program.args);
        }
    }).on('--help', function () {
       log.info('  Examples:');
       log.info();
       log.info('    $ litoria inline config.yaml');
       log.info();
    });

program.parse(process.argv);
