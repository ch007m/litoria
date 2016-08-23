/*
 * Prerequisites : Install nodejs & npm
 * Deploy package inlineCss : npm install --save inline-css
 * Doc : https://github.com/zurb/inline-css
 */

var fs        = require('fs')
var inlineCss = require('inline-css');

// Check if the path of the file to be converted is passed as parameter
if (process.argv[2]) {
    readHtmlFile(process.argv[2]);
} else {
    console.error("Please pass as parameter the path to the html file to be converted !")
}

function readHtmlFile(path) {
    fs.readFile(path, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        inline(data)
    });
}

function inline(html) {
    var options = {};
    options.url = 'file://' + html.path;
    options.extraCss = "http://cdnjs.cloudflare.com/ajax/libs/font-awesome/3.2.0/css/font-awesome.css"
    inlineCss(html, options).then(function (html) {
        // console.log(html);
        fs.writeFile("./output.html", html, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    });
}

