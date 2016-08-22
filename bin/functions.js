'use strict';

var fs = require('fs'),
    asciidoctor = require('asciidoctor.js')(),
    YAML = require('yamljs');

var opal = asciidoctor.Opal;
opal.load("nodejs");
var processor = asciidoctor.Asciidoctor();
var cfg = null;

module.exports = {
    listPackages: listPackages,
    listDirectories: listDirectories,
    convertToHtml: convertToHtml
};

function listPackages(pkgs,program) {
    if (!pkgs.length) {
        console.error('packages required');
        process.exit(1);
    }

    if (program.force)
        console.log('  force: install');
    pkgs.forEach(function(pkg){
        console.log('  install : %s', pkg);
    });
}

function listDirectories(pkgs,program) {
    if (!pkgs.length) {
        console.error('packages required');
        process.exit(1);
    }

    if (program.force)
        console.log('  force: install');
    pkgs.forEach(function(pkg){
        console.log('  install : %s', pkg);
    });
}

/*
 * Include within the header the link to the css file
 * Nevertheless we can't embed the css of foundation
 */
function convertToHtml(cfg_file) {

    var cfg = getConfig(cfg_file);
    if (cfg) {
        var f = fileName(cfg.file_to_process);
        var content = readFile(f);

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
function readFile(path) {
    return fs.readFileSync(path, 'utf8')
}

/*
 *
 */
function fileName(file_to_process) {
    return readFile(file_to_process);
}