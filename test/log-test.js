'use strict';

const test = require('tape');
const Log = require('../lib/log.js');

test('Should info.', t => {
  const log = new Log();
  log.info('foo');
  t.equal(1, 1);
  t.end();
});
