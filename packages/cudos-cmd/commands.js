const yargs = require('yargs')

const {
  initCmd,
  runCmd
} = require('../../cmd')

const { keysListCmd } = require('./keys/keysList.js')
const { keysAddCmd } = require('./keys/keysAdd.js')
const { keysRmCmd } = require('./keys/keysRm.js')
const { keysFundCmd } = require('./keys/keysFund.js')
const { compileCmd } = require('./compile/compile.js')
const { testCmd } = require('./test/test.js')
const { unitTestCmd } = require('./unittest/unittest.js')

const nodeCmd = require('../../cmd/node')
// const keysCmd = require('../../cmd/keys')

async function commands(args) {
  await yargs(args)
    .scriptName('cudos')
    .version()
    .usage('$0 <cmd> [args]')
    .command('init', 'create sample project', (yargs) => {
      yargs
        .option('dir', {
          alias: 'd',
          type: 'string',
          default: '.',
          description: 'project directory'
        })
    }, initCmd)
    .command('compile',
      'Compiles in alphabetical order the smart contracts in the workspace',
      (yargs) => {
      },
      compileCmd)
    .command(nodeCmd)
    .command('run <scriptFilePath>', 'run script', (yargs) => {
      yargs.positional('scriptFilePath', {
        type: 'string',
        describe: 'The path to to the script to run'
      })
    }, runCmd)
    .command('test',
      'run integration tests',
      (yargs) => { },
      testCmd)
    .command('unittest',
      'runs the unit tests of the smart contracts',
      (yargs) => { },
      unitTestCmd)
    .command(keysCmd)
    .demandCommand(1, 'No command specified!') // user must specify atleast one command
    .recommendCommands()
    .strictCommands() // checks if the command is specified, if its not - user friendly error
    .showHelpOnFail(true) // show help automatically
    .help()
    .argv
}

const keysCmd = {
  command: 'keys',
  describe: 'Manage accounts/keys',
  builder: (yargs) => {
    yargs.command('ls', 'List all accounts in the node key storage', () => {}, keysListCmd)
      .command('add <name>', 'Add account to the node key storage', () => {
        yargs.positional('name', {
          type: 'string',
          describe: 'account name'
        })
      }, keysAddCmd)
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
      }, keysRmCmd)
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
      }, keysFundCmd)
      .demandCommand(1, 'No command specified!') // user must specify atleast one command
  }
}

module.exports = {
  commands
}
