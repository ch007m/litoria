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
  $.createTestDir('test/generated');
  t.end();
});

/*
 * Create a simple litoria project using the init command the category simple for the project
 * Verify that the cfg file like the simple adoc file is there
 */
test('1. Create a simple litoria project. Command used litoria init', function (assert) {
  let dir = path.join(__dirname, 'generated/simple');
  let cfgExpected = path.join(__dirname, 'generated/simple/html-cfg.yaml');
  let simpleDocExpected = path.join(__dirname, 'generated/simple/source/simple.adoc');
  $.deleteFolderRecursive(dir);
  litoria.initProject('simple', null, dir);
  assert.ok($.fileExists(cfgExpected));
  assert.ok($.fileExists(simpleDocExpected));
  assert.end();
});

/*
 * After: Delte testing folder
 */
test('teardown', function (t) {
  $.deleteFolderRecursive('test/generated');
  t.end();
});
