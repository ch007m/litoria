'use strict';

const colors = require('colors');

class Log {

  constructor () {
    this.colors = colors;
  }

  transform (action, source, destination) {
    console.log(`${action}' '${source.cyan}' to '${destination.cyan}`);
  }

  debug (message) {
    console.log(` - ${message.blue}`);
  }

  info (message) {
    console.log(message.magenta);
  }

  warn (message) {
    console.log(message.yellow);
  }

  error (message) {
    console.log(message.red);
  }

  success (message) {
    console.log('');
    console.log('>>'.green + ' ' + message);
  }

  title (message) {
    console.log('');
    console.log(message.underline);
  }

}

module.exports = Log;
