'use strict';

const test = require('tape');
const path = require('path');
const litoria = require('../lib/litoria');
const $ = require('./common');

/*
 * Before:  Create testing folder
 */
test('setup', function (t) {
  // setup goes here, call t.end() when finished
  $.createTestDir('test/temp');
  t.end();
});

/*
 * Create a simple litoria project using the init command the category simple for the project
 * Verify that the cfg file like the simple adoc file is there
 */
test('1. Create a simple litoria project. Command used litoria init', function (t) {
  let dir = path.join(__dirname, 'temp/simple');
  let cfgExpected = path.join(__dirname, 'temp/simple/html-cfg.yaml');
  let simpleDocExpected = path.join(__dirname, 'temp/simple/source/simple.adoc');
  $.deleteFolderRecursive(dir);
  litoria.initProject('simple', null, dir);
  t.ok($.fileExists(cfgExpected));
  t.ok($.fileExists(simpleDocExpected));
  t.end();
});

/*
 * Generate the HTML content using litoria generate command & yaml config file
 */
test('2. Generate HTML content', function (t) {
  let cfgPath = path.join(__dirname, 'temp/simple/html-cfg.yaml');
  process.chdir(path.join(__dirname, 'temp/simple'));
  litoria.convertToHtml(cfgPath);
  let genFile = $.getFile(path.join(__dirname, 'temp/simple/generated/simple.html')).contents.toString('utf8');
  t.ok(genFile.includes('<h2 id="_the_dangerous_and_thrilling_documentation_chronicles">', true));
  t.end();
});

/*
 * After: Delete testing folder
 */
test('teardown', function (t) {
  $.deleteFolderRecursive('test/temp');
  t.end();
});
