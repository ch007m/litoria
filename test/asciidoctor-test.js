'use strict';

const test = require('tape');
const asciidoctor = require('asciidoctor.js')();
const fs = require('fs');
const path = require('path');
const gutil = require('gulp-util');

let opal;
let processor;

const testDir = 'test/generated';

function setup () {
  opal = asciidoctor.Opal;
  opal.load('nodejs');
  processor = asciidoctor.Asciidoctor();

  // Create local Directory
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir);
  }
}

function getFile (filePath) {
  return new gutil.File({
    path: path.resolve(filePath),
    cwd: './test/',
    base: path.dirname(filePath),
    contents: new Buffer(String(fs.readFileSync(filePath)))
  });
}

/*
 * Init
 */
setup();

// function fileExists (path) {
//   try {
//     fs.statSync(path);
//     return true;
//   } catch (err) {
//     if (err) {
//       console.error(err);
//     }
//     return !(err && err.code === 'ENOENT');
//   }
// }

// function removeFile (path) {
//   if (fileExists(path)) {
//     fs.unlinkSync(path);
//   }
// }

/*
 * Convert files from a directory
 */
// TODO - To be fixed when https://github.com/asciidoctor/asciidoctor.js/issues/221 is resolved
// test('1. Convert a Book to HTML using default stylesheet & Google Font', function (assert) {
//   var expectFilePath = path.join(__dirname, 'generated/book.html');
//   removeFile(expectFilePath);
//   var attrs = opal.hash({
//     nofooter: 'yes'
//   });
//   var options = opal.hash({
//     safe: 'unsafe',
//     header_footer: true,
//     to_dir: 'test/generated',
//     to_file: 'book.html',
//     attributes: attrs
//   });
//   processor.$convert_file(path.join(__dirname, 'fixtures/book.adoc'), options);
//   var content = fs.readFileSync(expectFilePath, 'utf8');
//   assert.ok(fileExists(expectFilePath));
//   assert.equal(content.includes('fonts.googleapis.com'), true);
//   assert.end();
// });

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
  let result = processor.$convert(content, options);

  assert.equal(result, expected, 'Render to HTML');
  assert.end();
});

/*
 * Convert an asciidoctor String using html5 as backend
 * The doctype : article
 * header_footer: true # Asciidoctor will include to the HTML generated the header section containing the link to the style and font to be used
 * The content is structured with a body, header, content & paragraph
 */
test('3. Convert adoc string to HTML using doctype: article, header_footer : true', function (assert) {
  let content = getFile(path.join('test', 'fixtures', 'simple.adoc')).contents.toString('utf8');
  let expected = getFile(path.join('test', 'fixtures', 'simple.html')).contents.toString('utf8');

  let options = opal.hash({doctype: 'article',
    header_footer: 'true',
    attributes: ['nofooter']});

  let result = processor.$convert(content, options);

  assert.equal(result, expected, 'Render to HTML');
  assert.end();
});

/*
 * Convert an asciidoctor file using html5 as backend
 * where the doctype is : article
 * The stylesheet used is asciidoctor-default.css
 * header_footer: true # Asciidoctor will include to the HTML generated the header section containing the link to the style and font to be used
 * The content is structured with a body, header, content & paragraph
 */
test('4. Convert adoc file to HTML using doctype: article, header_footer : true', function (assert) {
  let f = path.join('test', 'fixtures', 'simple2.adoc');
  let expected = getFile(path.join('test', 'fixtures', 'simple2.html')).contents.toString('utf8');

  let attrs = opal.hash({showtitle: '',
    stylesheet: 'asciidoctor-default.css',
    stylesdir: '../../test/css',
    nofooter: ''});

  let options = opal.hash({doctype: 'article',
    safe: 'unsafe',
    to_dir: 'test/generated',
    to_file: 'simple2.adoc.html',
    attributes: attrs});

  processor.$convert_file(f, options);

  let result = getFile(path.join('test', 'generated', 'simple2.adoc.html')).contents.toString('utf8');
  assert.equal(result, expected, 'Render to HTML');
  assert.end();
});

/*
 * Convert an asciidoctor String using html5 as backend
 * The doctype : article
 * header_footer: true # Asciidoctor will include to the HTML generated the header section containing the link to the style and font to be used
 * The content is structured with a body, header, content & paragraph
 */
test('5. Convert adoc string to HTML using doctype: article, header_footer: true and Save file according to_dir and to_file options', function (assert) {
  let content = getFile(path.join('test', 'fixtures', 'simple.adoc')).contents.toString('utf8');
  let expected = getFile(path.join('test', 'fixtures', 'simple-foundation.html')).contents.toString('utf8');

  let attrs = opal.hash({showtitle: '',
    stylesheet: 'foundation.css',
    stylesdir: 'test/css',
    nofooter: 'yes'});

  let options = opal.hash({doctype: 'article',
    safe: 'unsafe',
    header_footer: true,
    to_dir: 'test/generated',
    to_file: 'output.html',
    attributes: attrs});

  processor.$convert(content, options);

  let result = getFile(path.join('test', 'generated', 'output.html')).contents.toString('utf8');
  assert.equal(result, expected, 'Render to HTML');
  assert.end();
});
