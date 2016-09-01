#!/usr/bin/env node
var program = require('commander');
var $       = require('../lib/litoria.js');
var Log     = require("../lib/log");

var log = new Log();

/*
 * Generate command
 */
program
    .description('Send html content as body ohe mail to a sender')
    .usage('litoria send')
    .action(function () {
        if ($.isEmpty(program.args)) {
            log.error("No arguments have been passed to the command.");
            process.exit(0);
        } else {
            $.send(program.args);
        }
    }).on('--help', function () {
       log.info('  Examples:');
       log.info();
       log.info('    $ litoria send config.yaml');
       log.info();
    });

program.parse(process.argv);
