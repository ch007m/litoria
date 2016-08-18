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

// Check if the path of the file to be converted is passed as parameter
/*if (process.argv[2]) {
    //readFile(process.argv[2]);
    //convertToHtml3(process.argv[2]);
} else {
    console.error("Please pass as parameter the path to the html file to be converted !")
}*/

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
/*    var attrs = opal.hash({'showtitle'     : '',
                           'stylesheet'    : 'foundation.css',
                           'stylesdir'     : '/Users/chmoulli/Code/github/asciidoctor/asciidoctor-stylesheet-factory/stylesheets',
                           'nofooter'      : 'yes',
                           'linkcss'       : 'false'});
    var options = opal.hash({doctype       : 'article',
                             header_footer : 'false',
                             //to_dir        : '/Users/chmoulli/Google-Drive/REDHAT/RH-GP/Reports/2016/generated_content/',
                             //to_file       : '/Users/chmoulli/Google-Drive/REDHAT/RH-GP/Reports/2016/generated_content/output.html',
                             attributes    : attrs});*/
    var attrs = opal.hash(cfg.attributes);
    var options = opal.hash(cfg.options);
    options["$[]="]("attributes",attrs);
    // console.log(options);
    /* // show the values stored
    for (var k in options) {
        if (options.hasOwnProperty(k)) {
            console.log('key is: ' + k + ', value is: ' + options[k]);
        }
    }*/
    try {
        var html = processor.$convert(content, options);
        fs.writeFileSync("./generated_content/output.html", html);
        // processor.$convert(content, options);
    } catch (e) {
        console.error(e.stack);
    }
}

/*
 * Issue : mtime: undefined method `mtime' for #<File:0x1d0>
 at SingletonClass_alloc.$new (/Users/chmoulli/.nvm/versions/node/v4.2.0/lib/node_modules/asciidoctor.js/node_modules/opal-npm-wrapper/index.js:4512:15)
 */
function convertToHtml3(f) {
    var attrs = opal.hash({'showtitle'     : '',
        'stylesheet'    : 'foundation',
        'stylesdir'     : '/Users/chmoulli/Code/github/asciidoctor/asciidoctor-stylesheet-factory/stylesheets'});
    var options = opal.hash({doctype    : 'article',
        attributes : attrs});
    try {
        processor.$render_file(f, options);
    } catch (e) {
        console.error(e.stack);
    }
}

function copyFile(source, target) {
    return new Promise(function(resolve, reject) {
        var rd = fs.createReadStream(source);
        rd.on('error', reject);
        var wr = fs.createWriteStream(target);
        wr.on('error', reject);
        wr.on('finish', resolve);
        rd.pipe(wr);
    });
}