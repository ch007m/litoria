#!/usr/bin/env node
var program = require('commander');
var $ = require('../lib/litoria.js');
var Log = require('../lib/log');

var log = new Log();

/*
 * Server command
 */
program
    .description('Start a local HTTP Server hosting the content')
    .usage('litoria server')
    .option('-o, --open', 'open browser window after starting the server')
    .on('--help', function () {
      log.info('  Examples:');
      log.info();
      log.info('    $ litoria server server-cfg.yaml');
      log.info();
    })
    .parse(process.argv);

if ($.isEmpty(program.args)) {
  log.error('No arguments have been passed to the command.');
  process.exit(0);
} else {
  $.server(program.args, program.open !== undefined);
}
