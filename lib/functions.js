'use strict';

var data        = require('../package.json');
var fs          = require('fs');
var asciidoctor = require('asciidoctor.js')();
var YAML        = require('yamljs');
var inlineCss   = require('inline-css');
//var bunyan      = require('bunyan');

var opal = asciidoctor.Opal;
opal.load("nodejs");
var processor = asciidoctor.Asciidoctor();

module.exports = {
    convertToHtml: convertToHtml,
    inline: inline,
    isEmpty: isEmpty,
    // log: log,
    data: data
};

/*var log = bunyan.createLogger({
    name: 'cmd-line-tool',
    streams: [{
        level: "debug",
        path: "cmdtool.log"
    },
        {
            level: "info",
            stream: process.stdout
        }]
});*/

function isEmpty(str) {
    return (!str || 0 === str.length);
}

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
function inline(cfg_file) {
    var options = {};
    var cfg = getConfig(cfg_file);
    if (cfg) {
        var html = readHtmlFile(cfg.file_to_inline);
        options.url = 'file://' + cfg.file_to_inline.path;
        options.extraCss = "font-awesome.min.css"
        inlineCss(html, options).then(function (html) {
            fs.writeFile(cfg.file_inlined, html, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The inlined file " + cfg.file_inlined + " was saved!");
            });
        });
    }
}

/*
 *
 */
function getConfig(file) {
    return YAML.load('config.yaml');
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

/*
 *
 */
function readHtmlFile(path) {
    return fs.readFileSync(path, 'utf8');
}

