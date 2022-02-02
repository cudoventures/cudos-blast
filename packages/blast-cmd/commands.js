const { initCmd } = require('./init/init.js')
const {
  compileCmd,
  optimizerVer
} = require('./compile/compile.js')
const { testCmd } = require('./test/test.js')
const { unitTestCmd } = require('./unittest/unittest.js')
const { runCmd } = require('./run/run.js')
const keys = require('./keys/keys.js')
const node = require('./node/node.js')

const initInfo = {
  command: 'init',
  describe: 'Create a sample project',
  builder: (yargs) => {
    yargs.option('dir', {
      alias: 'd',
      type: 'string',
      default: '.',
      description: 'Project directory'
    })
  },
  handler: initCmd
}

const compileInfo = {
  command: 'compile',
  describe: 'Compile the smart contracts in the workspace in alphabetical order',
  builder: (yargs) => {
    yargs.option('optimizer', {
      alias: 'o',
      type: 'string',
      default: optimizerVer,
      description: 'Version of the cargo optimizer'
    })
  },
  handler: compileCmd
}

const testInfo = {
  command: 'test',
  describe: 'Run the integration tests',
  builder: (yargs) => {},
  handler: testCmd
}

const unitTestInfo = {
  command: 'unittest',
  describe: 'Run smart contracts\' unit tests',
  builder: (yargs) => {
    yargs.option('quiet', {
      alias: 'q',
      type: 'boolean',
      default: false,
      description: 'Hide cargo log messages'
    })
  },
  handler: unitTestCmd
}

const runInfo = {
  command: 'run <scriptFilePath>',
  describe: 'Run a single script',
  builder: (yargs) => {
    yargs.positional('scriptFilePath', {
      type: 'string',
      describe: 'Relative file path of the script'
    })
    yargs.option('network', {
      alias: 'n',
      type: 'string',
      default: 'http://localhost:26657',
      description: 'Set a custom network to connect'
    })
    yargs.option('account', {
      alias: 'a',
      type: 'string',
      default: 'account1',
      description: 'Set a custom signer account (account name is expected)'
    })
  },
  handler: runCmd
}

const keysInfo = {
  command: 'keys',
  describe: 'Manage node\'s accounts (keys)',
  builder: (yargs) => {
    yargs.command('ls', 'List all accounts in the local node key storage', () => {}, keys.keysListCmd)
      .command('add <name>', 'Add an account to the local node key storage', () => {
        yargs.positional('name', {
          type: 'string',
          describe: 'Account name to be added'
        })
        yargs.option('tty', {
          alias: 't',
          hidden: true,
          type: 'boolean',
          default: false
        })
      }, keys.keysAddCmd)
      .command('rm <name>', 'Remove an account from the local node key storage', () => {
        yargs.positional('name', {
          type: 'string',
          describe: 'Account name to be deleted'
        })
        yargs.option('force', {
          alias: 'f',
          type: 'boolean',
          default: false,
          description: 'Delete without confirmation'
        })
      }, keys.keysRmCmd)
      .command('fund <name>', 'Transfer tokens from the default local node faucet to selected account', () => {
        yargs.positional('name', {
          type: 'string',
          describe: 'Account name to be funded'
        })
        yargs.option('tokens', {
          alias: 't',
          type: 'string',
          required: true,
          describe: 'The amount of tokens in acudos. Example: --tokens 100000'
        })
      }, keys.keysFundCmd)
      .demandCommand(1, 'No command specified!') // user must specify atleast one command
  }
}

const nodeInfo = {
  command: 'node',
  describe: 'Manage a local CUDOS node',
  builder: (yargs) => {
    yargs.command('start', 'Start a fresh local node', () => {
      yargs.option('daemon', {
        alias: 'd',
        type: 'boolean',
        default: false,
        description: 'Run the node in background'
      })
    }, node.startNodeCmd)
      .command('stop', 'Stop the running local node', () => {}, node.stopNodeCmd)
      .command('status', 'Check if a local node is running', () => {}, node.nodeStatusCmd)
      .demandCommand(1, 'No command specified!') // user must specify atleast one command
  }
}

module.exports = {
  initInfo: initInfo,
  compileInfo: compileInfo,
  testInfo: testInfo,
  unitTestInfo: unitTestInfo,
  runInfo: runInfo,
  keysInfo: keysInfo,
  nodeInfo: nodeInfo
}
