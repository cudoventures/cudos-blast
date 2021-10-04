const {
    compile
} = require('./lib/commandService');

function compileCmd(argv) {
    try {
        compile(argv.name);
    } catch (e) {
        console.error(`${e}`);
        console.log('Execute cudo compile --help for more info.');
    }
}

module.exports.compileCmd = compileCmd;
