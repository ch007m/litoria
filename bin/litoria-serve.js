#!/usr/bin/env node
let program = require('commander');
let $ = require('../lib/litoria.js');
let Log = require('../lib/log');

let log = new Log();

/*
 * Server command
 */
program
    .description('Start a local HTTP Server hosting the content')
    .usage('litoria serve')
    .option('-o, --open', 'open browser window after starting the server')
    .on('--help', function () {
      log.info('  Examples:');
      log.info();
      log.info('    $ litoria serve server-cfg.yaml');
      log.info();
    })
    .parse(process.argv);

if ($.isEmpty(program.args)) {
  log.error('No arguments have been passed to the command.');
  process.exit(0);
} else {
  $.serve(program.args, program.open !== undefined);
}
