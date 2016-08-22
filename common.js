var fs = require('fs');
var config = {};

// Parse node.js package.json file
json = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

// Project version
config.version = json.version;
config.name = json.name;
config.description = json.description;

module.exports = config;