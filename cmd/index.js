const {
  initCmd
} = require('./init')

const {
  compileCmd
} = require('./compile')

const {
  runCmd
} = require('./run')

const {
  testCmd
} = require('./runtest')

const { unitTestCmd } = require('./run_unit_tests')

module.exports.initCmd = initCmd
module.exports.compileCmd = compileCmd
module.exports.runCmd = runCmd
module.exports.testCmd = testCmd
module.exports.unitTestCmd = unitTestCmd
