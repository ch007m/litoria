'use strict';

var data         = require('../package.json');
var fs           = require('fs');
var asciidoctor  = require('asciidoctor.js')();
var YAML         = require('yamljs');
var inlineCss    = require('inline-css');
var nodemailer   = require('nodemailer');
//var bunyan     = require('bunyan');

var opal = asciidoctor.Opal;
opal.load("nodejs");
var processor = asciidoctor.Asciidoctor();

module.exports = {
    convertToHtml: convertToHtml,
    inline: inline,
    isEmpty: isEmpty,
    send: sendEmail,
    // log: log,
    data: data
};

/*var log = bunyan.createLogger({
    name: 'litoria-line-tool',
    streams: [{
        level: "debug",
        path: "litoriatool.log"
    },
        {
            level: "info",
            stream: process.stdout
        }]
});*/

const connection = {
    host: 'smtp.corp.redhat.com',
    port: 25,
    secure: false,
    requireTLS: true,
    tls: {
        rejectUnauthorized: false
    },
    logger: true,
    debug: false
};

var mailOptions = {
    from: 'FROM',
    to: 'TO',
    subject: 'Weekly Report - USER', // Subject line
    html: ''
};


// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(connection);

/*
 *
 */
function sendEmail(cfg_file) {
    var cfg = getConfig(cfg_file);
    if (cfg) {
        mailOptions.html = getContent(cfg.file_inlined);
        mailOptions.subject = mailOptions.subject.replace("USER",cfg.userName);
        mailOptions.from = mailOptions.from.replace("FROM",cfg.fromEmail);
        mailOptions.to = mailOptions.to.replace("TO",cfg.toEmail);
        transporter.sendMail(mailOptions);
    } else {
        console.log("No cfg");
    }
}

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

