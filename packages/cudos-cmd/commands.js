const { initCmd } = require('./init/init.js')
const { compileCmd } = require('./compile/compile.js')
const { testCmd } = require('./test/test.js')
const { unitTestCmd } = require('./unittest/unittest.js')
const { runCmd } = require('./run/run.js')
const keys = require('./keys/keys.js')

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

const keysInfo = {
  command: 'keys',
  describe: 'Manage accounts/keys',
  builder: (yargs) => {
    yargs.command('ls', 'List all accounts in the node key storage', () => {}, keys.keysListCmd)
      .command('add <name>', 'Add account to the node key storage', () => {
        yargs.positional('name', {
          type: 'string',
          describe: 'account name'
        })
      }, keys.keysAddCmd)
      .command('rm <name>', 'Remove account from the node key storage', () => {
        yargs.positional('name', {
          type: 'string',
          describe: 'account name'
        })
        yargs.option('yes', {
          alias: 'y',
          type: 'boolean',
          default: false,
          description: 'Ignore the prompt.'
        })
      }, keys.keysRmCmd)
      .command('fund <name>', 'Fund tokens', () => {
        yargs.positional('name', {
          type: 'string',
          describe: 'account name'
        })
        yargs.option('tokens', {
          alias: 't',
          type: 'string',
          required: true,
          describe: 'amount of tokens in the format 10000000acudos'
        })
      }, keys.keysFundCmd)
      .demandCommand(1, 'No command specified!') // user must specify atleast one command
  }
}

module.exports = {
  initInfo: initInfo,
  compileInfo: compileInfo,
  testInfo: testInfo,
  unitTestInfo: unitTestInfo,
  runInfo: runInfo,
  keysInfo: keysInfo
}
