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
  .usage('litoria <generate> [project-path] [options]')
  .option('-r, --rendering [type]', 'rendering type - could be [html], pdf', 'html')
  .option('-c, --config <file>', 'config file to use')
  .parse(process.argv);

let cfgFile = program.config ? path.resolve(program.config) : null;

if (program.args[0]) {
  let projectPath = path.resolve(program.args[0]);
  if (!fs.existsSync(projectPath)) {
    log.warn('Project path not found: ' + projectPath);
    process.exit(1);
  }
  log.debug('Changing to project path : ' + projectPath);
  process.chdir(projectPath);
}

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
