#!/usr/bin/env node
let program = require('commander');
let path = require('path');
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
  .option('-p, --path <dir>', 'project path where the config file is located')
  .parse(process.argv);

/*
 * Call function responsible to convert the Asciidoc file(s) to HTML
 */
if ($.isEmpty(program.args)) {
  console.log('No config file has been passed to the command.');
  process.exit(0);
} else {
  if (program.path) {
    let projectPath = path.resolve(program.path);
    log.debug('Changing to project path : ' + projectPath);
    process.chdir(projectPath);
  }

  log.debug('Rendering : ' + program.rendering);
  switch (program.rendering) {
    case 'html':
      $.convertToHtml(program.args).catch(function (err) { console.error(err); process.exit(1); });
      break;
    case 'pdf':
      $.convertToPdf(program.args).catch(function (err) { console.error(err); process.exit(1); });
      break;
    default:
      console.error('Unknow rendering option : %s', program.rendering);
  }
}
