'use strict';

var asciidoctor  = require('asciidoctor.js')();
var async        = require('async');
var chalk        = require('chalk');
var cheerio      = require('cheerio');
var data         = require('../package.json');
var fs           = require('fs');
var glob         = require("glob");
var Log          = require("./log");
var https        = require('https');
var http         = require('http');
var inlineCss    = require('inline-css');
var nodemailer   = require('nodemailer');
var pdf          = require('html-pdf');
var util         = require('util');
var YAML         = require('yamljs');
var path         = require('path');

var _0777 = parseInt('0777', 8);

var templates         = [];
var configs           = [];
var templatesDir     = '../templates';
var adocExtension     = '*.adoc';
var htmlExtension     = '*.html';

var log = new Log();

var opal = asciidoctor.Opal;
opal.load("nodejs");
var processor = asciidoctor.Asciidoctor();

module.exports = {
    convertToHtml: convertToHtml,
    convertToPdf: convertToPdf,
    inline: inline,
    initProject: initProject,
    isEmpty: isEmpty,
    send: sendEmail,
    // log: log,
    data: data
};

function Builder() {
    this.targetGzStylesFile;
    this.targetGitRepo;
}

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

/*
 *
 */
function initProject(type,force,dir) {
    log.info("Category selected : " + type);
    switch(type) {
        case 'simple':
            templates = ["simple.adoc"];
            configs = ['config.yaml'];
            break;
        case 'management':
            templates = ["minute.adoc","report.adoc"];
            configs = ['config.yaml'];
            break;
        case 'lab':
            templates = ["lab.adoc"];
            configs = ['config.yaml'];
            break;
        case 'slideshow':
            log.warn("Not yet available. No adoc template will be added");
            configs = ['config.yaml'];
            templates = [];
            break;
        default:
            templates = ["simple.adoc"];
            configs = ['config.yaml'];
    }

    let projectDir = dir.toString();
    let projectSourceDir = path.join(projectDir,'source');

    //console.trace("Directory to be created : " + dir);
    mkDir(projectDir);
    log.info("Project created under this path : " + dir);

    // Create the different folders
    mkDirs([path.join(projectDir,'source'),path.join(projectDir,'source','css'),path.join(projectDir,'source','image'),path.join(projectDir,'generated')]);

    // Copy the config(s) to the project directory
    for (var i = 0, len = configs.length; i < len; i++) {
        let configPath = path.join(getTemplatesDir(),configs[i]);
        copyFile(configPath,projectDir);
        log.info("Copy the yaml config file : " + configs[i].toString() + " to the project");
    }

    // Copy the asciidoctor template(s) to the project source directory
    for (var i = 0, len = templates.length; i < len; i++) {
        let templatePath = path.join(getTemplatesDir(),templates[i]);
        copyFile(templatePath,projectSourceDir);
        log.info("Copy the template file : " + templates[i].toString() + " to the project");
    }

    // Copy the images from the templates directory to the project source directory
    let imagePath = path.join(getTemplatesDir(),'image');
    let pattern = imagePath + '/*.*';
    glob(pattern,{}, function (err, files) {
        let imagePath = path.join(projectSourceDir,'image');
        for (var i = 0; i < files.length; i++) {
            copyFile(files[i],imagePath);
        };
    });

    // Copy the css styles from the templates directory to the project source directory
    let cssPath = path.join(getTemplatesDir(),'css');
    pattern = cssPath + '/*.css';
    glob(pattern,{}, function (err, files) {
        let cssPath = path.join(projectSourceDir,'css');
        for (var i = 0; i < files.length; i++) {
            copyFile(files[i],cssPath);
        };
    });

    log.info("Project " + projectDir + " successfully created.");

    // Create within the target project the git repo
    /*
    console.log(chalk.green("Create the git repo folder : " + path.join(projectDir,'_git_repos')));
    var git_repo_dir = path.join(projectDir,'_git_repos');
    mkDir(git_repo_dir);

    var builder = new Builder();
    builder.targetGitRepo = git_repo_dir;
    builder.targetGzStylesFile = git_repo_dir + '/' + 'styles.tar.gz';
    log.info("Gz file : " + git_repo_dir + '/' + 'styles.tar.gz');

    var start = process.hrtime();
    async.series([
        function(callback) { builder.downloadDependencies(callback); }, // download deps
    ], function() {
        log.success('Done in ' + process.hrtime(start)[0] + 's');
        typeof callback === 'function' && callback();
    });
    */
}

Builder.prototype.downloadDependencies = function(callback) {
    log.title('download dependencies');
    var builder = this;

    async.series([
        function(callback) { builder.getContentFromURL('https://codeload.github.com/asciidoctor/asciidoctor-stylesheet-factory/zip/master', builder.targetGzStylesFile, callback); }

    ], function() {
        typeof callback === 'function' && callback();
    });
};

Builder.prototype.getContentFromURL = function(source, target, callback) {
    log.transform('get', source, target);
    var targetStream = fs.createWriteStream(target);
    var downloadModule;
    // startWith alternative
    if (source.lastIndexOf('https', 0) === 0) {
        downloadModule = https;
    } else {
        downloadModule = http;
    }
    downloadModule.get(source, function(response) {
        response.pipe(targetStream);
        targetStream.on('finish', function () {
            targetStream.close(callback);
        });
    });
};

/*
 *
 */
function convertToPdf(cfg) {
    var cfg = getConfig(cfg);
    if (cfg) {
        if (fs.statSync(cfg.source).isDirectory()) {
            log.info(cfg.source + " is a Directory.");

            var pattern = cfg.source + '/' + htmlExtension;
            glob(pattern,{}, function (err, files) {
                for (var i = 0; i < files.length; i++) {
                    console.log(files[i]);
                    var to_file = path.join(cfg.destination, getFileNameWithoutExtension(files[i]) + ".pdf");
                    var html = fs.readFileSync(files[i], 'utf8');
                    var imagePath = path.resolve(process.cwd(),cfg.destination);
                    log.debug("Image path : " + imagePath);

                    var $ = cheerio.load(html);
                    $('img').each(function(i, elem) {
                        var imgSrc = $(this).attr('src');
                        var newImgSrc = 'file://' + imagePath + '/' + imgSrc;
                        // log.debug( newImgSrc );
                        $(this).attr('src',newImgSrc);
                    });
                    var newHtml = $.html();

                    pdf.create(html, options).toFile(to_file, function(err, res) {
                        if (err) return console.log(err);
                        console.log(res);
                    });
                }
            });
        } else {
            log.info(cfg.source + " is a file.");
            let to_file = path.join(cfg.destination, getFileNameWithoutExtension(cfg.source) + ".pdf");
            let imagePath = path.join(process.cwd(), path.dirname(cfg.source));
            // log.debug("Image path : " + imagePath);

            let html = fs.readFileSync(cfg.source, 'utf8');

            let $ = cheerio.load(html);
            $('img').each(function(i, elem) {
                let imgSrc = $(this).attr('src');
                let newImgSrc = 'file://' + imagePath + '/' + imgSrc;
                // log.debug( newImgSrc );
                $(this).attr('src',newImgSrc);
            });
            let newHtml = $.html();
            // log.info(newHtml);

            let optionsJSON = JSON.stringify(cfg.pdf) || {"type": "pdf", "quality": "100"};
            let options = JSON.parse(optionsJSON);

            pdf.create(newHtml, options).toFile(to_file, function(err, res) {
                if (err) return console.log(err);
                console.log(res);
            });
        }
    }
}

/*
 * Generate the HTML and create the output file based on out_dir and out_file attributes
 */
function convertToHtml(cfg_file) {
    var cfg = getConfig(cfg_file);
    if (cfg) {
        if (fs.statSync(cfg.source).isDirectory()) {
            log.info(cfg.source + " is a Directory.");

            var pattern = cfg.source + '/' + adocExtension;
            glob(pattern,{}, function (err, files) {
                for (var i = 0; i < files.length; i++) {
                    console.log(files[i]);
                    cfg.options['to_file'] = getFileNameWithoutExtension(files[i]) + ".html";
                    var options = opal.hash(cfg.options);
                    var attrs = opal.hash(cfg.attributes);
                    options["$[]="]("attributes",attrs);
                    //console.log("Parameters : " + options);
                    processor.$convert_file(files[i], options);
                }
            });
        } else {
            log.info(cfg.source + " is a file.");
            var options = opal.hash(cfg.options);
            var attrs = opal.hash(cfg.attributes);
            options["$[]="]("attributes",attrs);
            processor.$convert_file(cfg.source, options);
        }
    }
}

/*
 *
 */
function parseFile(f,cfg) {
    var content;
    var toFile;

    if (f == null) {
        console.log("Convert file using source param of cfg %s",cfg.source);
        content = getContent(cfg.source);
    } else {
        content = getContent(f);
        var toFile = getFileNameWithoutExtension(f) + ".html";
        cfg.options['to_file'] = toFile;
    }

    var options = opal.hash(cfg.options);
    var attrs = opal.hash(cfg.attributes);

    options["$[]="]("attributes",attrs);
    console.trace("Parameters : " + options);

    try {
        processor.$convert(content, options);
    } catch (e) {
        console.error(e.stack);
    }
}

/*
 *
 */
function inline(cfg_file) {
    var options = {};
    // TODO - Check why commander gives us an array and not only the config file passed as parameter
    var cfg = getConfig(cfg_file[0]);
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
    log.debug("Config file : " + file.toString());
    return YAML.load(file.toString());
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

/*
 * Return a String of the Class type associated to an object
 */
function getObjectType(obj) {
    var toClass = {}.toString;
    return toClass.call(obj);
}

/*
 *
 */
function getFileNameWithoutExtension(file) {
    const f = path.basename(file);
    return f.replace(/\.[^/.]+$/,"");
}

/*
 *
 */
function isEmpty(str) {
    return (!str || 0 === str.length);
}

/*
 *
 */
function mkDirs(dirs) {
    for (var i = 0, len = dirs.length; i < len; i++) {
        mkDir(dir);
    };
}

/*
 * Synchronously create a new directory and any necessary subdirectories at dir with octal permission string opts.mode. If opts is a non-object, it will be treated as the opts.mode.
 *
 * If opts.mode isn't specified, it defaults to 0777 & (~process.umask()).
 *
 * Returns the first directory that had to be created, if any.
 */
function mkDir(p, opts, made) {
    if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }

    var mode = opts.mode;
    var xfs = opts.fs || fs;

    if (mode === undefined) {
        mode = _0777 & (~process.umask());
    }
    if (!made) made = null;

    p = path.resolve(p);

    try {
        xfs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = mkDir(path.dirname(p), opts, made);
                mkDir(p, opts, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already. If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = xfs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
};

/*
 * Copy file to the target directory
 */
function copyFile(srcPath, targetDir) {
    var f = path.basename(srcPath);
    var targetPath = path.join(targetDir,f);
    log.info("From: " + srcPath + ", to : " + targetPath);
    return new Promise(function(resolve, reject) {
        var rd = fs.createReadStream(srcPath);
        rd.on('error', reject);
        var wr = fs.createWriteStream(targetPath);
        wr.on('error', reject);
        wr.on('finish', resolve);
        rd.pipe(wr);
    });
}

/*
 *
 */
function getTemplatesDir(){
    return path.join(__dirname,templatesDir);
}

/*
 * Clone the repo to the target directory
 */
/*function gitCloneProject() {
    nodegit.Clone(url, local, cloneOpts).then(function (repo) {
        console.log("Cloned " + path.basename(url) + " to " + repo.workdir());
    }).catch(function (err) {
        console.log(err);
    });
}*/
