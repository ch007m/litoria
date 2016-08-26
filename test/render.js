var test = require('tape'),
    asciidoctor = require('asciidoctor.js')(),
    fs = require('fs'),
    path = require('path'),
    gutil = require('gulp-util');
var opal;
var test_dir = 'test/generated';

function setup() {
    opal = asciidoctor.Opal;
    opal.load("nodejs");
    processor = asciidoctor.Asciidoctor();

    // Create local Directory
    if (!fs.existsSync(test_dir)){
        fs.mkdirSync(test_dir);
    }
}

function getFile(filePath) {
    return new gutil.File({
        path: path.resolve(filePath),
        cwd: './test/',
        base: path.dirname(filePath),
        contents: new Buffer(String(fs.readFileSync(filePath)))
    });
}

/*
 * Init
 */
setup();

/*
 * Convert files from a directory
 */
test('Convert files from a directory', function(assert) {
    var attrs = opal.hash({showtitle: '',
        nofooter: 'yes'});
    var options = opal.hash({doctype: 'inline',
        safe: 'unsafe',
        to_dir: 'test/generated',
        attributes: attrs});
    opal.Asciidoctor.$convert('./test/fixtures/source/*.adoc', options);
    var result = getFile(path.join('test', 'generated', '.html')).contents.toString('utf8');
    assert.equal(result, "");
    assert.end();
});

/*
 * Convert an asciidoctor String using html5 as backend
 * The doctype defined is inline
 * The content is structured with just the content of paragraph. No HTML, body, header, content & paragraph tags are included
 */
test('Convert adoc string to HTML using doctype : inline', function(assert) {

    var content = "http://asciidoctor.org[*Asciidoctor*] " +
        "running on http://opalrb.org[_Opal_] " +
        "brings AsciiDoc to the browser!";
    var expected = '<a href="http://asciidoctor.org"><strong>Asciidoctor</strong></a> running on <a href="http://opalrb.org"><em>Opal</em></a> brings AsciiDoc to the browser!'

    var options = opal.hash({doctype: 'inline', attributes: ['showtitle']});

    var result = opal.Asciidoctor.$convert(content, options);

    assert.equal(result, expected,"Render to HTML");
    assert.end();
});

/*
 * Convert an asciidoctor String using html5 as backend
 * The doctype : article
 * header_footer: true # Asciidoctor will include to the HTML generated the header section containing the link to the style and font to be used
 * The content is structured with a body, header, content & paragraph
 */
test('Convert adoc string to HTML using doctype: article, header_footer : true', function(assert) {

    var content = getFile(path.join('test', 'fixtures', 'simple.adoc')).contents.toString('utf8');
    var expected = getFile(path.join('test', 'fixtures', 'simple.html')).contents.toString('utf8');

    var options = opal.hash({doctype: 'article',
                             header_footer: 'true',
                             attributes: ['nofooter']});

    var result = opal.Asciidoctor.$convert(content, options);

    assert.equal(result, expected,"Render to HTML");
    assert.end();
});

/*
 * Convert an asciidoctor file using html5 as backend
 * where the doctype is : article
 * The stylesheet used is asciidoctor-default.css
 * header_footer: true # Asciidoctor will include to the HTML generated the header section containing the link to the style and font to be used
 * The content is structured with a body, header, content & paragraph
 */
test('Convert adoc file to HTML using doctype: article, header_footer : true', function(assert) {

    var f = path.join('test', 'fixtures', 'simple2.adoc');
    var expected = getFile(path.join('test', 'fixtures', 'simple2.html')).contents.toString('utf8');

    var attrs = opal.hash({showtitle: '',
        stylesheet: 'asciidoctor-default.css',
        stylesdir: '../../test/css',
        nofooter: 'yes'});

    var options = opal.hash({doctype: 'article',
        safe: 'unsafe',
        to_dir: 'test/generated',
        to_file: 'simple2.adoc.html',
        attributes: attrs});

    opal.Asciidoctor.$convert_file(f, options);

    result = getFile(path.join('test', 'generated', 'simple2.adoc.html')).contents.toString('utf8');
    assert.equal(result, expected,"Render to HTML");
    assert.end();
});

/*
 * Convert an asciidoctor String using html5 as backend
 * The doctype : article
 * header_footer: true # Asciidoctor will include to the HTML generated the header section containing the link to the style and font to be used
 * The content is structured with a body, header, content & paragraph
 */
test('Convert adoc string to HTML using doctype: article, header_footer: true and Save file according to_dir and to_file options', function(assert) {

    var content = getFile(path.join('test', 'fixtures', 'simple.adoc')).contents.toString('utf8');
    var expected = getFile(path.join('test', 'fixtures', 'simple-foundation.html')).contents.toString('utf8');

    var attrs = opal.hash({showtitle: '',
        stylesheet: 'foundation.css',
        stylesdir: 'test/css',
        nofooter: 'yes'});

    var options = opal.hash({doctype: 'article',
        safe: 'unsafe',
        header_footer: 'true',
        to_dir: 'test/generated',
        to_file: 'output.html',
        attributes: attrs});

    opal.Asciidoctor.$convert(content, options);

    result = getFile(path.join('test', 'generated', 'output.html')).contents.toString('utf8');
    assert.equal(result, expected,"Render to HTML");
    assert.end();
});