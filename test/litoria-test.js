'use strict';

const test = require('tape');
const fs = require('fs');
const path = require('path');
const litoria = require('../lib/litoria');
const $ = require('./common');

let savedCwd;

/*
 * Before: Save cwd and create testing folder
 */
test('setup', function (t) {
  savedCwd = process.cwd();
  $.createTestDir('test/temp');
  t.end();
});

/*
 * isEmpty
 */
test('isEmpty returns true for empty or undefined values', function (t) {
  t.ok(litoria.isEmpty(''));
  t.ok(litoria.isEmpty(null));
  t.ok(litoria.isEmpty(undefined));
  t.notOk(litoria.isEmpty('hello'));
  t.end();
});

/*
 * Create a simple litoria project
 */
test('init: create a simple project', function (t) {
  let dir = path.join(__dirname, 'temp/simple');
  $.deleteFolderRecursive(dir);
  litoria.initProject('simple', null, dir);
  t.ok($.fileExists(path.join(dir, 'html-cfg.yaml')));
  t.ok($.fileExists(path.join(dir, 'pdf-cfg.yaml')));
  t.ok($.fileExists(path.join(dir, 'httpserver-cfg.yaml')));
  t.ok($.fileExists(path.join(dir, 'source/simple.adoc')));
  t.ok($.fileExists(path.join(dir, 'source/css')));
  t.ok($.fileExists(path.join(dir, 'source/image')));
  t.ok($.fileExists(path.join(dir, 'generated')));
  t.end();
});

/*
 * Create a management litoria project
 */
test('init: create a management project', function (t) {
  let dir = path.join(__dirname, 'temp/management');
  $.deleteFolderRecursive(dir);
  litoria.initProject('management', null, dir);
  t.ok($.fileExists(path.join(dir, 'html-cfg.yaml')));
  t.ok($.fileExists(path.join(dir, 'pdf-cfg.yaml')));
  t.ok($.fileExists(path.join(dir, 'smtp-cfg.yaml')));
  t.ok($.fileExists(path.join(dir, 'source/minute.adoc')));
  t.ok($.fileExists(path.join(dir, 'source/report.adoc')));
  t.end();
});

/*
 * Create a lab litoria project
 */
test('init: create a lab project', function (t) {
  let dir = path.join(__dirname, 'temp/lab');
  $.deleteFolderRecursive(dir);
  litoria.initProject('lab', null, dir);
  t.ok($.fileExists(path.join(dir, 'html-cfg.yaml')));
  t.ok($.fileExists(path.join(dir, 'pdf-cfg.yaml')));
  t.ok($.fileExists(path.join(dir, 'source/lab.adoc')));
  t.end();
});

/*
 * Create a project with unknown category falls back to simple
 */
test('init: unknown category falls back to simple', function (t) {
  let dir = path.join(__dirname, 'temp/unknown');
  $.deleteFolderRecursive(dir);
  litoria.initProject('nonexistent', null, dir);
  t.ok($.fileExists(path.join(dir, 'html-cfg.yaml')));
  t.ok($.fileExists(path.join(dir, 'source/simple.adoc')));
  t.end();
});

/*
 * Generate HTML content from a directory
 */
test('generate: HTML from a directory', function (t) {
  process.chdir(path.join(__dirname, 'temp/simple'));
  litoria.convertToHtml('html-cfg.yaml').then(function () {
    let genFile = $.getFile('generated/simple.html').contents.toString('utf8');
    t.ok(genFile.includes('<h2 id="_the_dangerous_and_thrilling_documentation_chronicles">', true));
    t.end();
  }).catch(function (err) {
    t.fail(err);
    t.end();
  });
});

/*
 * Generate HTML content for a single file
 */
test('generate: HTML for a single file', function (t) {
  let projectDirPath = path.join(__dirname, 'temp/simple');
  process.chdir(projectDirPath);
  $.searchReplaceStringInFile(projectDirPath + '/html-cfg.yaml', 'source: "./source"', 'source: "./source/simple.adoc"');
  litoria.convertToHtml('html-cfg.yaml').then(function () {
    let genFile = $.getFile('generated/simple.html').contents.toString('utf8');
    t.ok(genFile.includes('<h2 id="_the_dangerous_and_thrilling_documentation_chronicles">', true));
    t.end();
  }).catch(function (err) {
    t.fail(err);
    t.end();
  });
});

/*
 * Generate HTML from an external path (simulates --path option)
 */
test('generate: HTML using --path option', function (t) {
  process.chdir(savedCwd);
  let projectPath = path.join(__dirname, 'temp/simple');
  $.searchReplaceStringInFile(projectPath + '/html-cfg.yaml', 'source: "./source/simple.adoc"', 'source: "./source"');
  process.chdir(projectPath);
  litoria.convertToHtml('html-cfg.yaml').then(function () {
    let genFile = $.getFile('generated/simple.html').contents.toString('utf8');
    t.ok(genFile.includes('<h2 id="_the_dangerous_and_thrilling_documentation_chronicles">', true));
    process.chdir(savedCwd);
    t.end();
  }).catch(function (err) {
    process.chdir(savedCwd);
    t.fail(err);
    t.end();
  });
});

/*
 * Generate HTML content with default stylesheet
 */
test('generate: HTML with default stylesheet', function (t) {
  let projectDirPath = path.join(__dirname, 'temp/simple');
  process.chdir(projectDirPath);
  $.searchReplaceStringInFile(projectDirPath + '/html-cfg.yaml', 'stylesheet: \'foundation.css\'', '');
  $.searchReplaceStringInFile(projectDirPath + '/html-cfg.yaml', 'stylesdir: \'css\'', '');
  litoria.convertToHtml('html-cfg.yaml').then(function () {
    let genFile = $.getFile('generated/simple.html').contents.toString('utf8');
    t.ok(genFile.includes('<h2 id="_the_dangerous_and_thrilling_documentation_chronicles">', true));
    t.ok(genFile.includes('Asciidoctor default stylesheet', true));
    t.end();
  }).catch(function (err) {
    t.fail(err);
    t.end();
  });
});

/*
 * toArray: convert JSON object to array of key=value strings
 */
test('toArray: converts attributes object to array', function (t) {
  var result = litoria._toArray({stylesheet: 'foundation.css', nofooter: '', icons: 'font'});
  t.deepEqual(result, ['stylesheet=foundation.css', 'nofooter', 'icons=font']);
  t.end();
});

test('toArray: returns empty array for empty object', function (t) {
  var result = litoria._toArray({});
  t.deepEqual(result, []);
  t.end();
});

/*
 * getFileNameWithoutExtension
 */
test('getFileNameWithoutExtension: strips extension', function (t) {
  t.equal(litoria._getFileNameWithoutExtension('document.adoc'), 'document');
  t.equal(litoria._getFileNameWithoutExtension('/path/to/file.html'), 'file');
  t.equal(litoria._getFileNameWithoutExtension('no-ext'), 'no-ext');
  t.equal(litoria._getFileNameWithoutExtension('multi.dots.txt'), 'multi.dots');
  t.end();
});

/*
 * mapPdfOptions: convert old html-pdf config to puppeteer options
 */
test('mapPdfOptions: basic options', function (t) {
  var result = litoria._mapPdfOptions({format: 'Letter', orientation: 'landscape'});
  t.equal(result.format, 'Letter');
  t.equal(result.landscape, true);
  t.equal(result.printBackground, true);
  t.notOk(result.margin);
  t.notOk(result.displayHeaderFooter);
  t.end();
});

test('mapPdfOptions: defaults to A4 portrait', function (t) {
  var result = litoria._mapPdfOptions({});
  t.equal(result.format, 'A4');
  t.equal(result.landscape, false);
  t.end();
});

test('mapPdfOptions: border to margin', function (t) {
  var result = litoria._mapPdfOptions({
    border: {top: '10mm', right: '15mm', bottom: '10mm', left: '15mm'}
  });
  t.deepEqual(result.margin, {top: '10mm', right: '15mm', bottom: '10mm', left: '15mm'});
  t.end();
});

test('mapPdfOptions: border with partial values defaults to 0', function (t) {
  var result = litoria._mapPdfOptions({
    border: {top: '10mm'}
  });
  t.equal(result.margin.top, '10mm');
  t.equal(result.margin.right, '0');
  t.equal(result.margin.bottom, '0');
  t.equal(result.margin.left, '0');
  t.end();
});

test('mapPdfOptions: header and footer with page placeholders', function (t) {
  var result = litoria._mapPdfOptions({
    header: {contents: {default: 'Page {{page}} of {{pages}}'}},
    footer: {contents: {default: '{{page}}/{{pages}}'}}
  });
  t.ok(result.displayHeaderFooter);
  t.equal(result.headerTemplate, 'Page <span class="pageNumber"></span> of <span class="totalPages"></span>');
  t.equal(result.footerTemplate, '<span class="pageNumber"></span>/<span class="totalPages"></span>');
  t.end();
});

test('mapPdfOptions: header without contents', function (t) {
  var result = litoria._mapPdfOptions({header: {}});
  t.ok(result.displayHeaderFooter);
  t.notOk(result.headerTemplate);
  t.end();
});

/*
 * After: Restore cwd and delete testing folder
 */
test('teardown', function (t) {
  process.chdir(savedCwd);
  $.deleteFolderRecursive(path.join(__dirname, 'temp'));
  t.end();
});
