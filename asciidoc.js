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