'use strict';

var fs = require('fs'),
    asciidoctor = require('asciidoctor.js')(),
    YAML = require('yamljs');

var opal = asciidoctor.Opal;
opal.load("nodejs");
var processor = asciidoctor.Asciidoctor();
var cfg = null;

module.exports = {
    convertToHtml: convertToHtml
};

/*
 * Generate the HTML and create the output file based on out_dir and out_file attributes
 */
function convertToHtml(cfg_file) {

    var cfg = getConfig(cfg_file);
    if (cfg) {
        var content = getContent(cfg.file_to_process);
        //console.log("Content to process : %s",content);

        var attrs = opal.hash(cfg.attributes);
        var options = opal.hash(cfg.options);
        options["$[]="]("attributes",attrs);

        try {
            processor.$convert(content, options);
        } catch (e) {
            console.error(e.stack);
        }

    }
}

/*
 *
 */
function getConfig(file) {
    return cfg = YAML.load('config.yaml');
}

/*
 *
 */
function getContent(path) {
    return fs.readFileSync(path, 'utf8')
}

/*
 *
 */
function readFile(path) {
    return fs.readFileSync(path, 'utf8')
}