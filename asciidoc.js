var asciidoctor = require('asciidoctor.js')(),
    fs = require('fs'),
    YAML = require('yamljs');

var processor = null,
    useExtensions = true,
    cfg = null;

var opal = asciidoctor.Opal;
opal.load("nodejs");

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