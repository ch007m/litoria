'use strict';

const test = require('tape');
const Log = require('../lib/log.js');
const stdout = require('test-console').stdout;

test('Should log info with magenta color.', t => {
  const log = new Log();
  const magenta = stdout.inspectSync(() => log.info('magenta'));
  t.deepEqual(magenta, ['\x1b[35mmagenta\x1b[39m\n']);
  t.end();
});

test('Should debug with blue color.', t => {
  const log = new Log();
  const blue = stdout.inspectSync(() => log.debug('blue'));
  t.deepEqual(blue, [' - ' + '\x1b[34mblue\x1b[39m\n']);
  t.end();
});

test('Should warn with yellow color.', t => {
  const log = new Log();
  const yellow = stdout.inspectSync(() => log.warn('yellow'));
  t.deepEqual(yellow, ['\x1b[33myellow\x1b[39m\n']);
  t.end();
});

test('Should error with red color.', t => {
  const log = new Log();
  const red = stdout.inspectSync(() => log.error('red'));
  t.deepEqual(red, ['\x1b[31mred\x1b[39m\n']);
  t.end();
});

test('Should success with green arrow color.', t => {
  const log = new Log();
  const green = stdout.inspectSync(() => log.success('green'));
  t.deepEqual(green[1], ['\x1b[32m>>\x1b[39m green\n'][0]);
  t.end();
});

test('Should title with underline.', t => {
  const log = new Log();
  const underline = stdout.inspectSync(() => log.title('underline'));
  t.deepEqual(underline[1], ['\x1b[4munderline\x1b[24m\n'][0]);
  t.end();
});

test('Static cyan should return cyan-colored string.', t => {
  const result = Log.cyan('test');
  t.equal(result, '\x1b[36mtest\x1b[39m');
  t.end();
});

test('Should transform with cyan-colored source and destination.', t => {
  const log = new Log();
  const output = stdout.inspectSync(() => log.transform('copy', 'src', 'dest'));
  t.equal(output[0], "copy' '\x1b[36msrc\x1b[39m' to '\x1b[36mdest\x1b[39m\n");
  t.end();
});
