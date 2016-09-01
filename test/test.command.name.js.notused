var test = require('tape');
var program = require('commander');
// var sinon = require('sinon').sandbox.create();

test("Commander", function(t) {

    /*
    sinon.stub(process, 'exit');
    sinon.stub(process.stdout, 'write');
    */

    // ,{noHelp: true}

    program.command('mycommand [options]','this is my command')
           .version('0.0.1');

    program.parse(['test']);

    t.true(typeof program.name === 'function');
    t.equal(program.version(), '0.0.1');
    t.equal(program.commands[0].name(), 'mycommand');
    t.equal(program.commands[1].name(), 'help');

    //var output = process.stdout.write.args[0];
    // t.equal(output[0],'');

    t.end();
    // sinon.restore();
});
