// Parse package.json file to read config
var data = require('./package.json');
var colors = require('colors');

module.exports = {
    data: data,
    makeRed: makeRed
};


function makeRed(txt) {
    return colors.red(txt); //display the help text in red on the console
}