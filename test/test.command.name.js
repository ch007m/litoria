var test = require('tape');
var program = require('commander');
var sinon = require('sinon').sandbox.create();

test("Simple command test", function (t) {

    sinon.stub(process, 'exit');
    sinon.stub(process.stdout, 'write');

    program
        .command('mycommand [options]', 'this is my command');

    program.parse(['node', 'test']);

    t.ok(typeof program.name === 'function')
    t.strictEquals(program.name(), 'test')
    t.equals(program.commands[0].name(), 'mycommand');
    t.equals(program.commands[1].name(), 'help');

/*    var output = process.stdout.write.args[0];
    t.equals(output[0],'    mycommand [options]  this is my command');*/

    t.end;

    sinon.restore();
});