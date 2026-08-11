#!/usr/bin/env node
let program = require('commander');
let fs = require('fs');
let path = require('path');
let $ = require('../lib/litoria.js');
let Log = require('../lib/log');

let log = new Log();

/*
 * Send Email command
 */
program
  .description('Send html content as body of the mail to a sender')
  .usage('litoria send [project-path] [options]')
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

$.send(cfgFile);
