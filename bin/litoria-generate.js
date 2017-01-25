#!/usr/bin/env node
let program = require('commander');
let $ = require('../lib/litoria.js');
let Log = require('../lib/log');

let log = new Log();

/*
 * Generate command
 */
program
    .description('generate html from the asciidoc file using html5 as backend')
    .usage('litoria <generate> [options]')
    .option('-r, --rendering [type]', 'rendering type - could be [html], pdf', 'html')
    .parse(process.argv);

/*
 * Call function responsible to convert the Asciidoc file(s) to HTML
 */
if ($.isEmpty(program.args)) {
  console.log('No config file has been passed to the command.');
  process.exit(0);
} else {
  log.debug('Rendering : ' + program.rendering);
  switch (program.rendering) {
    case 'html':
      $.convertToHtml(program.args);
      break;
    case 'pdf':
      $.convertToPdf(program.args);
      break;
    default:
      console.error('Unknow rendering option : %s', program.rendering);
  }
}
