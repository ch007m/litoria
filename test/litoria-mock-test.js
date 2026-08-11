'use strict';

const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();
const path = require('path');
const fs = require('fs');
const $ = require('./common');

function createMockLitoria (overrides) {
  var defaults = {
    '@hapi/hapi': {
      server: function () {
        return {
          register: function () { return Promise.resolve(); },
          start: function () { return Promise.resolve(); },
          stop: function () { return Promise.resolve(); },
          route: function () {},
          info: {uri: 'http://localhost:3000'}
        };
      }
    },
    '@hapi/inert': {},
    'nodemailer': {
      createTransport: function () {
        return {
          sendMail: function (opts, cb) { cb(null, {messageId: 'test'}); },
          close: function () {}
        };
      }
    },
    'puppeteer': {
      launch: function () {
        return Promise.resolve({
          newPage: function () {
            return Promise.resolve({
              setContent: function () { return Promise.resolve(); },
              evaluate: function () { return Promise.resolve(); },
              pdf: function () { return Promise.resolve(); }
            });
          },
          close: function () { return Promise.resolve(); }
        });
      }
    },
    'opener': function () {}
  };
  var stubs = Object.assign({}, defaults, overrides || {});
  return proxyquire('../lib/litoria', stubs);
}

let savedCwd;

test('mock-setup', function (t) {
  savedCwd = process.cwd();
  $.createTestDir('test/temp');
  t.end();
});

/*
 * startServer
 */
test('startServer: starts Hapi server with config', function (t) {
  var registered = false;
  var started = false;
  var routeSet = false;
  var litoria = createMockLitoria({
    '@hapi/hapi': {
      server: function (opts) {
        t.equal(opts.port, 3000);
        return {
          register: function () { registered = true; return Promise.resolve(); },
          start: function () { started = true; return Promise.resolve(); },
          route: function () { routeSet = true; },
          info: {uri: 'http://localhost:3000'}
        };
      }
    }
  });
  var cfgDir = path.join(__dirname, 'temp/server-test');
  $.deleteFolderRecursive(cfgDir);
  litoria.initProject('simple', null, cfgDir);
  process.chdir(cfgDir);
  litoria.serve('httpserver-cfg.yaml').then(function () {
    t.ok(registered, 'Inert plugin registered');
    t.ok(started, 'Server started');
    t.ok(routeSet, 'Route configured');
    t.end();
  }).catch(function (err) {
    t.fail(err);
    t.end();
  });
});

test('startServer: opens browser when option is true', function (t) {
  var opened = false;
  var litoria = createMockLitoria({
    'opener': function (uri) { opened = true; }
  });
  var cfgDir = path.join(__dirname, 'temp/server-open-test');
  $.deleteFolderRecursive(cfgDir);
  litoria.initProject('simple', null, cfgDir);
  process.chdir(cfgDir);
  litoria.serve('httpserver-cfg.yaml', true).then(function () {
    t.ok(opened, 'Browser opened');
    t.end();
  }).catch(function (err) {
    t.fail(err);
    t.end();
  });
});

/*
 * sendEmail
 */
test('sendEmail: sends mail via nodemailer', function (t) {
  var sentOptions = null;
  var litoria = createMockLitoria({
    'nodemailer': {
      createTransport: function () {
        return {
          sendMail: function (opts, cb) { sentOptions = opts; cb(null, {messageId: 'test-123'}); },
          close: function () {}
        };
      }
    }
  });
  var cfgDir = path.join(__dirname, 'temp/email-test');
  $.deleteFolderRecursive(cfgDir);
  litoria.initProject('management', null, cfgDir);
  process.chdir(cfgDir);

  fs.mkdirSync(path.join(cfgDir, 'generated'), {recursive: true});
  fs.writeFileSync(path.join(cfgDir, 'generated/output-inlined.html'), '<html><body>Test</body></html>');

  litoria.send('smtp-cfg.yaml');
  setTimeout(function () {
    t.ok(sentOptions, 'Mail was sent');
    t.equal(sentOptions.subject, 'Title of the Subject');
    t.end();
  }, 100);
});

test('sendEmail: handles error from transporter', function (t) {
  var litoria = createMockLitoria({
    'nodemailer': {
      createTransport: function () {
        return {
          sendMail: function (opts, cb) { cb(new Error('SMTP error')); },
          close: function () {}
        };
      }
    }
  });
  var cfgDir = path.join(__dirname, 'temp/email-err-test');
  $.deleteFolderRecursive(cfgDir);
  litoria.initProject('management', null, cfgDir);
  process.chdir(cfgDir);

  fs.mkdirSync(path.join(cfgDir, 'generated'), {recursive: true});
  fs.writeFileSync(path.join(cfgDir, 'generated/output-inlined.html'), '<html>Test</html>');

  litoria.send('smtp-cfg.yaml');
  setTimeout(function () {
    t.pass('Error handled without crash');
    t.end();
  }, 100);
});

/*
 * convertToPdf: single file
 */
test('convertToPdf: converts a single HTML file', function (t) {
  var pdfGenerated = false;
  var litoria = createMockLitoria({
    'puppeteer': {
      launch: function () {
        return Promise.resolve({
          newPage: function () {
            return Promise.resolve({
              setContent: function () { return Promise.resolve(); },
              evaluate: function () { return Promise.resolve(); },
              pdf: function () { pdfGenerated = true; return Promise.resolve(); }
            });
          },
          close: function () { return Promise.resolve(); }
        });
      }
    }
  });
  var cfgDir = path.join(__dirname, 'temp/pdf-test');
  $.deleteFolderRecursive(cfgDir);
  litoria.initProject('simple', null, cfgDir);
  process.chdir(cfgDir);

  fs.mkdirSync(path.join(cfgDir, 'generated_content'), {recursive: true});
  fs.mkdirSync(path.join(cfgDir, 'generated_pdf'), {recursive: true});
  fs.writeFileSync(path.join(cfgDir, 'generated_content/my_file.html'),
    '<html><body><img src="image/logo.png"/>Hello</body></html>');

  litoria.convertToPdf('pdf-cfg.yaml').then(function () {
    t.ok(pdfGenerated, 'PDF was generated');
    t.end();
  }).catch(function (err) {
    t.fail(err);
    t.end();
  });
});

/*
 * convertToPdf: directory of HTML files with images
 */
test('convertToPdf: converts a directory of HTML files with images', function (t) {
  var pdfCount = 0;
  var litoria = createMockLitoria({
    'puppeteer': {
      launch: function () {
        return Promise.resolve({
          newPage: function () {
            return Promise.resolve({
              setContent: function () { return Promise.resolve(); },
              evaluate: function () { return Promise.resolve(); },
              pdf: function () { pdfCount++; return Promise.resolve(); }
            });
          },
          close: function () { return Promise.resolve(); }
        });
      }
    }
  });
  var cfgDir = path.join(__dirname, 'temp/pdf-dir-test');
  $.deleteFolderRecursive(cfgDir);
  litoria.initProject('simple', null, cfgDir);
  process.chdir(cfgDir);

  var srcDir = path.join(cfgDir, 'generated_content');
  fs.mkdirSync(srcDir, {recursive: true});
  fs.mkdirSync(path.join(cfgDir, 'generated_pdf'), {recursive: true});
  fs.writeFileSync(path.join(srcDir, 'page1.html'),
    '<html><body><img src="image/logo.png"/><p>Page 1</p></body></html>');
  fs.writeFileSync(path.join(srcDir, 'page2.html'),
    '<html><body><p>Page 2</p></body></html>');

  var cfgContent = [
    'source: "./generated_content"',
    'destination: "./generated_pdf"',
    'pdf:',
    '  format: A4',
    '  zoomFactor: "0.55"'
  ].join('\n');
  fs.writeFileSync(path.join(cfgDir, 'pdf-dir-cfg.yaml'), cfgContent);

  litoria.convertToPdf('pdf-dir-cfg.yaml').then(function () {
    t.equal(pdfCount, 2, 'Both HTML files converted to PDF');
    t.end();
  }).catch(function (err) {
    t.fail(err);
    t.end();
  });
});

/*
 * inline: inlines CSS into HTML
 */
test('inline: inlines CSS into HTML file', function (t) {
  var inlinedHtml = null;
  var litoria = createMockLitoria({
    'inline-css': function (html, opts) {
      inlinedHtml = html;
      return Promise.resolve('<html><body style="color:red">Inlined</body></html>');
    }
  });
  var cfgDir = path.join(__dirname, 'temp/inline-test');
  $.deleteFolderRecursive(cfgDir);
  litoria.initProject('simple', null, cfgDir);
  process.chdir(cfgDir);

  fs.mkdirSync(path.join(cfgDir, 'generated'), {recursive: true});
  fs.writeFileSync(path.join(cfgDir, 'generated/output.html'),
    '<html><head><style>body{color:red}</style></head><body>Test</body></html>');

  litoria.inline(['html-cfg.yaml']);
  setTimeout(function () {
    t.ok(inlinedHtml, 'inline-css was called');
    t.end();
  }, 200);
});

/*
 * convertToPdf: no pdf config defaults to A4
 */
test('convertToPdf: defaults to A4 when no pdf config', function (t) {
  var pdfOpts = null;
  var litoria = createMockLitoria({
    'puppeteer': {
      launch: function () {
        return Promise.resolve({
          newPage: function () {
            return Promise.resolve({
              setContent: function () { return Promise.resolve(); },
              evaluate: function () { return Promise.resolve(); },
              pdf: function (opts) { pdfOpts = opts; return Promise.resolve(); }
            });
          },
          close: function () { return Promise.resolve(); }
        });
      }
    }
  });
  var cfgDir = path.join(__dirname, 'temp/pdf-noconfig-test');
  $.deleteFolderRecursive(cfgDir);
  litoria.initProject('simple', null, cfgDir);
  process.chdir(cfgDir);

  fs.mkdirSync(path.join(cfgDir, 'generated_content'), {recursive: true});
  fs.mkdirSync(path.join(cfgDir, 'generated_pdf'), {recursive: true});
  fs.writeFileSync(path.join(cfgDir, 'generated_content/my_file.html'),
    '<html><body>Test</body></html>');

  var cfgContent = [
    'source: "./generated_content/my_file.html"',
    'destination: "./generated_pdf"'
  ].join('\n');
  fs.writeFileSync(path.join(cfgDir, 'no-pdf-cfg.yaml'), cfgContent);

  litoria.convertToPdf('no-pdf-cfg.yaml').then(function () {
    t.equal(pdfOpts.format, 'A4', 'Default format is A4');
    t.end();
  }).catch(function (err) {
    t.fail(err);
    t.end();
  });
});

/*
 * initProject: creating project in deeply nested non-existent path triggers recursive mkDir
 */
test('initProject: creates deeply nested directory path', function (t) {
  var litoria = createMockLitoria();
  var dir = path.join(__dirname, 'temp/deep/nested/path/project');
  $.deleteFolderRecursive(path.join(__dirname, 'temp/deep'));
  litoria.initProject('simple', null, dir);
  t.ok($.fileExists(path.join(dir, 'html-cfg.yaml')));
  t.ok($.fileExists(path.join(dir, 'source/simple.adoc')));
  t.end();
});

/*
 * mock-teardown
 */
test('mock-teardown', function (t) {
  process.chdir(savedCwd);
  $.deleteFolderRecursive(path.join(__dirname, 'temp'));
  t.end();
});
