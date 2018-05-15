'use strict';

const test = require('tape');
const asciidoctor = require('asciidoctor.js')();
const fs = require('fs');
const path = require('path');
const $ = require('./common');

let processor;
/*
 * Before: Create testing folder, initialize Opal & Asciidoctor processor
 */
test('setup', function (t) {
  processor = asciidoctor;
  require('asciidoctor-reveal.js');
  $.createTestDir('test/temp');
  t.end();
});

/*
 * Generate Revealjs slideshow presentation
 */
test('1. Convert a slides.adoc to HTML Slideshow using Revealjs', function (assert) {
  let expectFilePath = path.join(__dirname, 'temp/slides.html');
  let revealjsDir = path.join(__dirname, '../', 'node_modules/reveal.js');
  let options = {
    safe: 'safe',
    backend: 'revealjs',
    to_dir: 'test/temp',
    attributes: ['revealjsdir=' + revealjsDir]};
  processor.convertFile(path.join(__dirname, 'fixtures/slides.adoc'), options);

  let content = fs.readFileSync(expectFilePath, 'utf8');
  assert.ok($.fileExists(expectFilePath));
  assert.equal(content.includes('<section id="slide_one"'), true);
  assert.equal(content.includes('<section id="slide_two"'), true);
  assert.end();
});

/*
 * After : Delete testing folder
 */
test('teardown', function (t) {
  $.deleteFolderRecursive(path.join(__dirname, 'temp'));
  t.end();
});
