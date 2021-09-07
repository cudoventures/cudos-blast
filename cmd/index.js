const {
    initCmd
} = require("./init");

const {
    compileCmd
} = require("./compile");

const {
    runCmd
} = require("./run");

const {
    testCmd
} = require("./runtest");

module.exports.initCmd = initCmd;
module.exports.compileCmd = compileCmd;
module.exports.runCmd = runCmd;
module.exports.testCmd = testCmd;