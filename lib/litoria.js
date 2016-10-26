'use strict';

const fsExtra = require('fs-extra');
var asciidoctor = require('asciidoctor.js')();
var async = require('async');
var cheerio = require('cheerio');
var data = require('../package.json');
var fs = require('fs');
var glob = require('glob');
const Hapi = require('hapi');
var Log = require('./log');
var https = require('https');
var http = require('http');
const Inert = require('inert');
var inlineCss = require('inline-css');
var nodemailer = require('nodemailer');
var opener = require('opener');
const Path = require('path');
var pdf = require('html-pdf');
var tar = require('tar-fs');
var YAML = require('yamljs');
var path = require('path');
var zlib = require('zlib');

var _0777 = parseInt('0777', 8);

var projectDir, projectSourceDir;
var templates = [];
var configs = [];
var repos = {};
var templatesDir = '../templates';
var adocExtension = '*.adoc';
var htmlExtension = '*.html';

var log = new Log();

var opal = asciidoctor.Opal;
opal.load('nodejs');
var processor = asciidoctor.Asciidoctor();

module.exports = {
  convertToHtml: convertToHtml,
  convertToPdf: convertToPdf,
  inline: inline,
  initProject: initProject,
  isEmpty: isEmpty,
  send: sendEmail,
  serve: startServer,
  // log: log,
  data: data
};

function Builder () {
}

/*
 * Start a local HTTP Server
 */
function startServer (cfgFile, openBrowser) {
  var cfg = getConfig(cfgFile);
  if (cfg) {
    // Configure the HTTP Server connection based on the options defined within the YAML config file
    let conJSON = JSON.stringify(cfg.http);
    const connection = JSON.parse(conJSON);
    const publidDir = Path.join(process.cwd(), cfg.source);

    const server = new Hapi.Server({
      connections: {
        routes: {
          files: {
            relativeTo: publidDir
          }
        }
      }
    });
    server.connection({port: connection.port, address: connection.address});
    server.register(Inert, () => {
    });
    server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          path: '.',
          listing: true
        }
      }
    });
    server.start((err) => {
      if (err) {
        throw err;
      }
      log.info(`Server running at: ${server.info.uri} & hosting this content ${publidDir}`);
      if (openBrowser) {
        opener(server.info.uri);
      }
    });
  }
}

/*
 * Send an email to the SMTP Server using as mail content the html inlined css file
 */
function sendEmail (cfgFile) {
  var cfg = getConfig(cfgFile);
  if (cfg) {
    // Configure the SMTP connection based on the options defined within the YAML config file
    let conJSON = JSON.stringify(cfg.smtp);
    const connection = JSON.parse(conJSON);

    // Create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport(connection);

    // Configure the Mail parameters (From, To, Subject, ...) based on the options defined within the YAML config file
    let mailJSON = JSON.stringify(cfg.mail);
    const mailOptions = JSON.parse(mailJSON);

    mailOptions.html = getContent(cfg.file_inlined);
    mailOptions.subject = mailOptions.subject;
    mailOptions.from = mailOptions.from;
    mailOptions.to = mailOptions.to;
    transporter.sendMail(mailOptions);
  } else {
    log.error('No config file or options defined');
  }
}

/*
 *
 */
function initProject (type, force, dir) {
  log.info('Category selected : ' + type);
  switch (type) {
    case 'simple':
      templates = ['simple.adoc'];
      configs = ['httpserver-cfg.yaml', 'html-cfg.yaml', 'pdf-cfg.yaml'];
      break;
    case 'management':
      templates = ['minute.adoc', 'report.adoc'];
      configs = ['httpserver-cfg.yaml', 'html-cfg.yaml', 'pdf-cfg.yaml', 'smtp-cfg.yaml'];
      break;
    case 'lab':
      templates = ['lab.adoc'];
      configs = ['httpserver-cfg.yaml', 'html-cfg.yaml', 'pdf-cfg.yaml'];
      break;
    case 'slideshow':
      log.warn('Not yet available. No adoc template will be added');
      templates = ['slideshow.adoc'];
      repos = {
        'revealjs': 'https://codeload.github.com/hakimel/reveal.js/tar.gz/3.3.0',
        'revealjsbackend': 'https://codeload.github.com/asciidoctor/asciidoctor-reveal.js/tar.gz/master'
      };
      configs = ['httpserver-cfg.yaml', 'slideshow-cfg.yaml'];
      break;
    default:
      templates = ['simple.adoc'];
      configs = ['httpserver-cfg.yaml', 'html-cfg.yaml', 'pdf-cfg.yaml'];
  }

  projectDir = dir.toString();
  projectSourceDir = path.join(projectDir, 'source');

  // console.trace("Directory to be created : " + dir)

  try {
    mkDir(projectDir);
    log.info('Project created : ' + dir);
  } catch (err) {
    process.exit(1);
  }

  // Create the different folders
  mkDirs([path.join(projectDir, '_temp'),
    path.join(projectDir, 'source'),
    path.join(projectDir, 'source', 'css'),
    path.join(projectDir, 'source', 'image'),
    path.join(projectDir, 'generated')]);

  // Copy the config(s) to the project directory
  for (var i = 0, len = configs.length; i < len; i++) {
    let configPath = path.join(getTemplatesDir(), 'config', configs[i]);
    copyFile(configPath, projectDir);
    log.info('Copy the yaml config file : ' + configs[i].toString() + ' to the project');
  }

  // Copy the asciidoctor *.adoc files to the project source directory
  for (let i = 0, len = templates.length; i < len; i++) {
    let templatePath = path.join(getTemplatesDir(), templates[i]);
    copyFile(templatePath, projectSourceDir);
    log.info('Copy the template file : ' + templates[i].toString() + ' to the project');
  }

  // Copy the images from the templates directory to the project source directory
  var results = glob.sync(getTemplatesDir() + '/image/*.*');
  if (results.length > 0) {
    let imageDestPath = path.join(projectSourceDir, 'image');
    for (let i = 0; i < results.length; i++) {
      log.info('Copy the image : ' + results[i]);
      copyFile(results[i], imageDestPath);
    }
  }

  // Copy the css styles from the templates directory to the project source directory
  results = glob.sync(getTemplatesDir() + '/css/*.*');
  if (results.length > 0) {
    let cssDestPath = path.join(projectSourceDir, 'css');
    for (let i = 0; i < results.length; i++) {
      copyFile(results[i], cssDestPath);
    }
  }

  log.info('Project ' + projectDir + ' successfully created.');

  if (type === 'slideshow') {
    // Download the compressed files defined
    var builder = new Builder();

    var start = process.hrtime();
    async.series([
      // TODO - Add Clean
      function (callback) {
        builder.downloadDependencies(callback);
      }
    ], function () {
      log.success('Done in ' + process.hrtime(start)[0] + 's');
      // TODO: who is callback() ?
      typeof callback === 'function';
      /* && callback() */
    });
  }
}

Builder.prototype.downloadDependencies = function (callback) {
  log.title('download dependencies');
  var builder = this;

  async.series([
    function (callback) {
      builder.getContentFromURL(repos.revealjs, path.join(projectDir, '_temp', 'revealjs.tar.gz'), callback);
    }, // download revealjs project
    function (callback) {
      builder.getContentFromURL(repos.revealjsbackend, path.join(projectDir, '_temp', 'revealjs-backend.zip'), callback);
    }, // download revealjs backends
    function (callback) {
      builder.untar(path.join(projectDir, '_temp', 'revealjs.tar.gz'), 'revealjs', path.join(projectDir, '_temp'), callback);
    },
    function (callback) {
      builder.untar(path.join(projectDir, '_temp', 'revealjs-backend.zip'), 'revealjs-backend', path.join(projectDir, '_temp'), callback);
    },
    function (callback) {
      copyDir(path.join(projectDir, '_temp', 'revealjs'), path.join(projectDir, 'generated', 'reveal.js'));
      callback();
    },
    function (callback) {
      fs.rename(path.join(projectDir, '_temp', 'revealjs-backend', 'templates', 'jade'), path.join(projectDir, '_temp', 'revealjs-backend', 'revealjs'));
      callback();
    }
  ], function () {
    typeof callback === 'function' && callback();
  });
};

Builder.prototype.getContentFromURL = function (source, target, callback) {
  log.transform('get', source, target);
  var targetStream = fs.createWriteStream(target);
  var downloadModule;
  // startWith alternative
  if (source.lastIndexOf('https', 0) === 0) {
    downloadModule = https;
  } else {
    downloadModule = http;
  }
  downloadModule.get(source, function (response) {
    response.pipe(targetStream);
    targetStream.on('finish', function () {
      targetStream.close(callback);
    });
  });
};

/*
 *
 */
Builder.prototype.untar = function (source, baseDirName, destinationDir, callback) {
  var stream = fs.createReadStream(source).pipe(zlib.createGunzip()).pipe(tar.extract(destinationDir, {
    map: function (header) {
      // REMIND Do NOT user path.sep!
      // In this case, even on Windows, the separator is '/'.
      var paths = header.name.split('/');
      // replace base directory with 'baseDirName'
      paths.shift();
      paths.unshift(baseDirName);
      header.name = paths.join('/');
      return header;
    }
  }));
  stream.on('finish', function () {
    callback();
  });
};

/*
 * Copy content of a directory to another directory recursively
 */
function copyDir (src, dest) {
  mkDir(dest);
  var files = fs.readdirSync(src);
  for (var i = 0; i < files.length; i++) {
    var current = fs.lstatSync(path.join(src, files[i]));
    if (current.isDirectory()) {
      copyDir(path.join(src, files[i]), path.join(dest, files[i]));
    } else if (current.isSymbolicLink()) {
      var symlink = fs.readlinkSync(path.join(src, files[i]));
      fs.symlinkSync(symlink, path.join(dest, files[i]));
    } else {
      copyFile(path.join(src, files[i]), dest);
    }
  }
}

/*
 *
 */
function convertToPdf (cfg) {
  cfg = getConfig(cfg);
  if (cfg) {
    if (fs.statSync(cfg.source).isDirectory()) {
      log.info(cfg.source + ' is a Directory.');

      let results = glob.sync(cfg.source + '/' + htmlExtension);
      if (results.length > 0) {
        for (let i = 0; i < results.length; i++) {
          log.info(results[i]);
          var toFile = path.join(cfg.destination, getFileNameWithoutExtension(results[i]) + '.pdf');
          var html = fs.readFileSync(results[i], 'utf8');
          var imagePath = path.resolve(process.cwd(), cfg.destination);
          log.debug('Image path : ' + imagePath);

          var $ = cheerio.load(html);
          $('img').each(function (i, elem) {
            var imgSrc = $(this).attr('src');
            var newImgSrc = 'file://' + imagePath + '/' + imgSrc;
            // log.debug( newImgSrc )
            $(this).attr('src', newImgSrc);
          });
          // unused
          // var newHtml = $.html();

          let optionsJSON = JSON.stringify(cfg.pdf) || {'type': 'pdf', 'quality': '100'};
          let options = JSON.parse(optionsJSON);

          pdf.create(html, options).toFile(toFile, function (err, res) {
            if (err) return console.log(err);
            console.log(res);
          });
        }
      }
    } else {
      log.info(cfg.source + ' is a file.');
      let toFile = path.join(cfg.destination, getFileNameWithoutExtension(cfg.source) + '.pdf');
      let imagePath = path.join(process.cwd(), path.dirname(cfg.source));
      // log.debug("Image path : " + imagePath)

      let html = fs.readFileSync(cfg.source, 'utf8');

      let $ = cheerio.load(html);
      $('img').each(function (i, elem) {
        let imgSrc = $(this).attr('src');
        let newImgSrc = 'file://' + imagePath + '/' + imgSrc;
        // log.debug( newImgSrc )
        $(this).attr('src', newImgSrc);
      });
      let newHtml = $.html();
      // log.info(newHtml)

      let optionsJSON = JSON.stringify(cfg.pdf) || {'type': 'pdf', 'quality': '100'};
      let options = JSON.parse(optionsJSON);

      pdf.create(newHtml, options).toFile(toFile, function (err, res) {
        if (err) return console.log(err);
        console.log(res);
      });
    }
  }
}

/*
 * Generate the HTML and create the output file based on out_dir and out_file attributes
 */
function convertToHtml (cfgFile) {
  let cfg = getConfig(cfgFile);
  if (cfg) {
    if (fs.statSync(cfg.source).isDirectory()) {
      log.info(cfg.source + ' is a Directory.');

      const pattern = cfg.source + '/' + adocExtension;
      const results = glob.sync(pattern);
      if (results.length > 0) {
        for (let i = 0; i < results.length; i++) {
          console.log(results[i]);
          cfg.options['to_file'] = getFileNameWithoutExtension(results[i]) + '.html';
          let options = opal.hash(cfg.options);
          let attrs = opal.hash(cfg.attributes);
          options['$[]=']('attributes', attrs);
          log.info('Parameters : ' + options);
          processor.$convert_file(results[i], options);
        }
      }
    } else {
      log.info(cfg.source + ' is a file.');
      let options = opal.hash(cfg.options);
      options.$store('to_file', getFileNameWithoutExtension(cfg.source) + '.html');
      options.$store('to_dir', cfg.destination);
      let attrs = opal.hash(cfg.attributes);
      options['$[]=']('attributes', attrs);
      log.info('Params : ' + options);
      processor.$convert_file(cfg.source, options);
    }
  }
}

/*
 *
 */
// unused
// function parseFile (f, cfg) {
//   var content;
//   var toFile;

//   if (f == null) {
//     console.log('Convert file using source param of cfg %s', cfg.source);
//     content = getContent(cfg.source);
//   } else {
//     content = getContent(f);
//     toFile = getFileNameWithoutExtension(f) + '.html';
//     cfg.options['to_file'] = toFile;
//   }

//   var options = opal.hash(cfg.options);
//   var attrs = opal.hash(cfg.attributes);

//   options['$[]=']('attributes', attrs);
//   console.trace('Parameters : ' + options);

//   try {
//     processor.$convert(content, options);
//   } catch (e) {
//     console.error(e.stack);
//   }
// }

/*
 *
 */
function inline (cfgFile) {
  let options = {};
  // TODO - Check why commander gives us an array and not only the config file passed as parameter
  const cfg = getConfig(cfgFile[0]);
  if (cfg) {
    var html = readHtmlFile(cfg.file_to_inline);
    options.url = 'file://' + cfg.file_to_inline.path;
    options.extraCss = 'font-awesome.min.css';
    inlineCss(html, options).then(function (html) {
      fs.writeFile(cfg.file_inlined, html, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log('The inlined file ' + cfg.file_inlined + ' was saved!');
      });
    });
  }
}

/*
 *
 */
function getConfig (file) {
  log.debug('Config file : ' + file.toString());
  return YAML.load(file.toString());
}

/*
 *
 */
function getContent (path) {
  return fs.readFileSync(path, 'utf8');
}

/*
 *
 */
// unused
// function readFile (path) {
//   return fs.readFileSync(path, 'utf8');
// }

/*
 *
 */
function readHtmlFile (path) {
  return fs.readFileSync(path, 'utf8');
}

/*
 * Return a String of the Class type associated to an object
 */
// unused
// function getObjectType (obj) {
//   var toClass = {}.toString;
//   return toClass.call(obj);
// }

/*
 *
 */
function getFileNameWithoutExtension (file) {
  const f = path.basename(file);
  return f.replace(/\.[^/.]+$/, '');
}

/*
 *
 */
function isEmpty (str) {
  return (!str || str.length === 0);
}

/*
 *
 */
function mkDirs (dirs) {
  for (var i = 0, len = dirs.length; i < len; i++) {
    mkDir(dirs[i]);
  }
}

/*
 * Synchronously create a new directory and any necessary subdirectories at dir with octal permission string opts.mode. If opts is a non-object, it will be treated as the opts.mode.
 *
 * If opts.mode isn't specified, it defaults to 0777 & (~process.umask()).
 *
 * Returns the first directory that had to be created, if any.
 */
function mkDir (p, opts, made) {
  if (!opts || typeof opts !== 'object') {
    opts = {mode: opts};
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
  } catch (err0) {
    switch (err0.code) {
      case 'ENOENT':
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
        } catch (err1) {
          throw err0;
        }
        if (stat.isDirectory()) {
          log.error('Directory already exists !');
          throw err0;
        }
    }
  }

  return made;
}

/*
 * Copy file to the target directory
 */
function copyFile (srcPath, targetDir) {
  const targetPath = path.join(targetDir, path.basename(srcPath));
  try {
    log.info(`From: ${srcPath}, to : ${targetPath}`);
    fsExtra.copySync(srcPath, targetPath);
  } catch (error) {
    console.error(error);
  }
}

/*
 *
 */
function getTemplatesDir () {
  return path.join(__dirname, templatesDir);
}
