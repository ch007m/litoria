#!/usr/bin/env node
let program = require('commander');
let fs = require('fs');
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
  .option('-c, --config <file>', 'config file to use')
  .parse(process.argv);

if (program.path) {
  let projectPath = path.resolve(program.path);
  log.debug('Changing to project path : ' + projectPath);
  process.chdir(projectPath);
}

let cfgFile = program.config || program.args[0];

if (!cfgFile) {
  if (fs.existsSync('config.yaml')) {
    cfgFile = 'config.yaml';
  } else if (fs.existsSync('config.yml')) {
    cfgFile = 'config.yml';
  } else {
    log.warn('No config file found. Pass one with -c <file> or create a config.yaml in the project directory.');
    process.exit(1);
  }
}

if (!fs.existsSync(cfgFile)) {
  log.warn('Config file not found: ' + cfgFile);
  process.exit(1);
}

log.debug('Using config file : ' + cfgFile);
log.debug('Rendering : ' + program.rendering);

switch (program.rendering) {
  case 'html':
    $.convertToHtml(cfgFile).catch(function (err) { console.error(err); process.exit(1); });
    break;
  case 'pdf':
    $.convertToPdf(cfgFile).catch(function (err) { console.error(err); process.exit(1); });
    break;
  default:
    console.error('Unknown rendering option : %s', program.rendering);
}
