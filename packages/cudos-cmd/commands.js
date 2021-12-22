const { runCmd } = require('./run/run.js')
const { initCmd } = require('./init/init.js')
const { compileCmd } = require('./compile/compile.js')
const { testCmd } = require('./test/test.js')
const { unitTestCmd } = require('./unittest/unittest.js')

const initInfo = {
  command: 'init',
  describe: 'create sample project',
  builder: (yargs) => {
    yargs.option('dir', {
      alias: 'd',
      type: 'string',
      default: '.',
      description: 'project directory'
    })
  },
  handler: initCmd
}

const compileInfo = {
  command: 'compile',
  describe: 'Compiles in alphabetical order the smart contracts in the workspace',
  builder: (yargs) => {},
  handler: compileCmd
}

const runInfo = {
  command: 'run <scriptFilePath>',
  describe: 'run script',
  builder: (yargs) => {
    yargs.positional('scriptFilePath', {
      type: 'string',
      describe: 'The path to to the script to run'
    })
  },
  handler: runCmd
}

const testInfo = {
  command: 'test',
  describe: 'run integration tests',
  builder: (yargs) => {},
  handler: testCmd
}

const unitTestInfo = {
  command: 'unittest',
  describe: 'runs the unit tests of the smart contracts',
  builder: (yargs) => {},
  handler: unitTestCmd
}

module.exports = {
  initInfo: initInfo,
  compileInfo: compileInfo,
  testInfo: testInfo,
  unitTestInfo: unitTestInfo,
  runInfo: runInfo
}
