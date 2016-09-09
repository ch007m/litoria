#!/usr/bin/env node
let program = require('commander');
let $ = require('../lib/litoria.js');
let Log = require('../lib/log');

let log = new Log();

/*
 * Inline command
 */
program
    .description('Inline the css content of a file')
    .usage('litoria inline')
    .on('--help', function () {
      log.info('  Examples:');
      log.info();
      log.info('    $ litoria inline config.yaml');
      log.info();
    })
    .parse(process.argv);

if ($.isEmpty(program.args)) {
  log.error('No arguments have been passed to the command.');
  process.exit(0);
} else {
  log.info('File will be inlined !');
  $.inline(program.args);
}
