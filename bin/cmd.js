#!/usr/bin/env node

var program = require('commander'),
    config = require('../common.js');

program
    .version(config.version)
    .command('list', 'list packages installed')
    .command('install [name]', 'install one or more packages').alias('i')
    .command('search [query]', 'search with optional query').alias('s')
    .command('publish', 'publish the package').alias('p')
    .parse(process.argv);