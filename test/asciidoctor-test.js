'use strict';

const test = require('tape');
const asciidoctor = require('asciidoctor.js')();
const fs = require('fs');
const path = require('path');
const Fidelity = require('fidelity');
const $ = require('./common');

let opal;
let processor;

function convert (content, options) {
  return new Fidelity((resolve, reject) => {
    try {
      resolve(processor.$convert(content, options));
    } catch (error) {
      return reject(error);
    }
  });
}

/*
 * Before: Create testing folder, initialize Opal & Asciidoctor processor
 */
test('setup', function (t) {
  opal = asciidoctor.Opal;
  opal.load('nodejs');
  processor = asciidoctor.Asciidoctor();
  $.createTestDir('test/temp');
  t.end();
});

/*
 * Convert file using default css style and check that Google font is added
 */
test('1. Convert a Book to HTML using default stylesheet & Google Font', function (assert) {
  var expectFilePath = path.join(__dirname, 'temp/book.html');
  $.removeFile(expectFilePath);
  var attrs = opal.hash({
    nofooter: 'yes'
  });
  var options = opal.hash({
    safe: 'unsafe',
    header_footer: true,
    to_dir: 'test/temp',
    to_file: 'book.html',
    attributes: attrs
  });
  processor.$convert_file(path.join(__dirname, 'fixtures/book.adoc'), options);
  var content = fs.readFileSync(expectFilePath, 'utf8');
  assert.ok($.fileExists(expectFilePath));
  assert.equal(content.includes('fonts.googleapis.com'), true);
  assert.end();
});

/*
 * Convert an asciidoctor String using html5 as backend
 * The doctype defined is inline
 * The content is structured with just the content of paragraph. No HTML, body, header, content & paragraph tags are included
 */
test('2. Convert adoc string to HTML using doctype : inline', function (assert) {
  let content = 'http://asciidoctor.org[*Asciidoctor*] ' +
    'running on http://opalrb.org[_Opal_] ' +
    'brings AsciiDoc to the browser!';
  let expected = '<a href="http://asciidoctor.org"><strong>Asciidoctor</strong></a> running on <a href="http://opalrb.org"><em>Opal</em></a> brings AsciiDoc to the browser!';

  let options = opal.hash({doctype: 'inline', attributes: ['showtitle']});

  convert(content, options)
    .then(result => {
      assert.equal(result, expected, 'Render to HTML');
      assert.end();
    }).catch(error => {
      console.error(error);
      assert.fail();
    });
});

/*
 * Convert an asciidoctor doc using html5 as backend
 * The doctype : article
 * header_footer: true # Asciidoctor will include to the HTML generated the header section containing the link to the style and font to be used
 * The content is structured with a body, header, content & paragraph
 */
test('3. Convert adoc string to HTML using doctype: article, header_footer : true', function (assert) {
  let content = $.getFile(path.join('test', 'fixtures', 'simple.adoc')).contents.toString('utf8');
  let expected = $.getFile(path.join('test', 'fixtures', 'simple-links.html')).contents.toString('utf8');

  let options = opal.hash({
    doctype: 'article',
    header_footer: 'true',
    attributes: ['nofooter']
  });

  convert(content, options)
    .then(result => {
      assert.equal(result, expected, 'Render to HTML');
      assert.end();
    }).catch(error => {
      console.error(error);
      assert.fail();
    });
});

/*
 * Convert an asciidoctor file using html5 as backend
 * where the doctype is : article
 * stylesheet : asciidoctor-default.css
 * header_footer: true # Asciidoctor will include to the HTML generated the header section containing the link to the style and font to be used
 * The content is structured with a body, header, content & paragraph
 */
test('4. Convert adoc file to HTML using doctype: article, header_footer : true', function (assert) {
  let f = path.join('test', 'fixtures', 'simple.adoc');
  let expected = $.getFile(path.join('test', 'fixtures', 'simple-css-embedded.html')).contents.toString('utf8');

  let attrs = opal.hash({
    showtitle: '',
    stylesheet: 'asciidoctor-default.css',
    stylesdir: '../../test/css',
    nofooter: ''
  });

  let options = opal.hash({
    doctype: 'article',
    safe: 'unsafe',
    to_dir: 'test/temp',
    to_file: 'simple.adoc.html',
    attributes: attrs
  });

  processor.$convert_file(f, options);

  let result = $.getFile(path.join('test', 'temp', 'simple.adoc.html')).contents.toString('utf8');
  assert.equal(result, expected, 'Render to HTML');
  assert.end();
});

/*
 * Convert an asciidoctor doc including an image using html5 as backend
 * The doctype : article
 * header_footer: true # Asciidoctor will include to the HTML generated the header section containing the link to the style and font to be used
 * stylesheet: foundation
 * The content is structured with a body, header, content & paragraph
 */
test('5. Convert adoc file including an image to HTML using doctype: article, header_footer: true and Save file according to_dir and to_file options', function (assert) {
  let content = $.getFile(path.join('test', 'fixtures', 'simple-image.adoc')).contents.toString('utf8');

  let attrs = opal.hash({
    showtitle: '',
    stylesheet: 'foundation.css',
    stylesdir: 'test/css',
    nofooter: 'yes'
  });

  let options = opal.hash({
    doctype: 'article',
    safe: 'unsafe',
    header_footer: true,
    to_dir: 'test/temp',
    to_file: 'output.html',
    attributes: attrs
  });

  convert(content, options)
    .then(result => {
      let file = $.getFile(path.join('test', 'temp', 'output.html')).contents.toString('utf8');
      assert.ok(file.includes('src="image/litoria-chloris.jpg"', true));
      assert.end();
    }).catch(error => {
      console.error(error);
      assert.fail();
    });
});

/*
 * After : Delete testing folder
 */
test('teardown', function (t) {
  $.deleteFolderRecursive(path.join(__dirname, 'temp'));
  t.end();
});
