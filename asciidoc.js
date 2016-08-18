var asciidoctor = require('asciidoctor.js')();
var fs = require('fs')
var YAML = require('yamljs');

var opal = asciidoctor.Opal;
var processor = null;
var useExtensions = true;
var cfg = null;
var cssDir = './generated_content/css';
var styleDir = '/Users/chmoulli/Code/github/asciidoctor/asciidoctor-stylesheet-factory/stylesheets';
var style = 'foundation.css';
var sourceFile = styleDir + "/" + style;
var targetFile = cssDir + "/" + style;

if (useExtensions) {
    processor = asciidoctor.Asciidoctor(true);
}
else {
    processor = asciidoctor.Asciidoctor();
}

// Read YAML Config
cfg = YAML.load('config.yaml');
if (cfg) {
    readFile(cfg.file_to_process);
}

// Create css directory under generated_content
if (!fs.existsSync(cssDir)){
    fs.mkdirSync(cssDir);
}

fs.writeFileSync(targetFile, fs.readFileSync(sourceFile));


function readFile(path) {
    var content = fs.readFileSync(path, 'utf8')
    convertToHtml(content);
}

/*
 * Include within the header the link to the css file
 * Nevertheless we can't embed the css of foundation
 */
function convertToHtml(content) {

    var attrs = opal.hash(cfg.attributes);
    var options = opal.hash(cfg.options);
    options["$[]="]("attributes",attrs);

    try {
        var html = processor.$convert(content, options);
        fs.writeFileSync("./generated_content/output.html", html);
        // processor.$convert(content, options);
    } catch (e) {
        console.error(e.stack);
    }
}