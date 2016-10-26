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
 * Source directory will be scanned to find the *adoc files to be generated
 */
test('2. Generate HTML content from a directory', function (t) {
  process.chdir(path.join(__dirname, 'temp/simple'));
  litoria.convertToHtml('html-cfg.yaml');
  let genFile = $.getFile('generated/simple.html').contents.toString('utf8');
  t.ok(genFile.includes('<h2 id="_the_dangerous_and_thrilling_documentation_chronicles">', true));
  t.end();
});

/*
 * Generate the HTML content using litoria generate command & yaml config file
 * The source location corresponds to source/simple.adoc file
 */
test('3. Generate HTML content for a file', function (t) {
  let projectDirPath = path.join(__dirname, 'temp/simple');
  process.chdir(projectDirPath);
  $.searchReplaceStringInFile(projectDirPath + '/html-cfg.yaml', 'source: "./source"', 'source: "./source/simple.adoc"');
  litoria.convertToHtml('html-cfg.yaml');
  let genFile = $.getFile('generated/simple.html').contents.toString('utf8');
  t.ok(genFile.includes('<h2 id="_the_dangerous_and_thrilling_documentation_chronicles">', true));
  t.end();
});

/*
 * Generate the HTML content using litoria generate command & yaml config file
 * Use the default stylesheet
 */
test('4. Generate HTML content', function (t) {
  let projectDirPath = path.join(__dirname, 'temp/simple');
  process.chdir(projectDirPath);
  $.searchReplaceStringInFile(projectDirPath + '/html-cfg.yaml', 'stylesheet: \'foundation.css\'', '');
  $.searchReplaceStringInFile(projectDirPath + '/html-cfg.yaml', 'stylesdir: \'css\'', '');
  litoria.convertToHtml('html-cfg.yaml');
  let genFile = $.getFile('generated/simple.html').contents.toString('utf8');
  t.ok(genFile.includes('<h2 id="_the_dangerous_and_thrilling_documentation_chronicles">', true));
  t.ok(genFile.includes('Asciidoctor default stylesheet', true));
  t.end();
});

/*
 * After: Delete testing folder
 */
test('teardown', function (t) {
  $.deleteFolderRecursive(path.join(__dirname, 'temp'));
  t.end();
});
