var fs = require('fs');
var config = {};

// Parse package.json file to read properties
json = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

// Set common properties
config.version = json.version;
config.name = json.name;
config.description = json.description;

module.exports = config;