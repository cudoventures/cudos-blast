const VError = require('verror')

const {
  keysListNode,
  addAccountNode,
  deleteAccountNode,
  fundAccountNode
} = require('./lib/commandService')

const {
  client
} = require('./lib')

const list = async function () {
  try {
    keysListNode()
  } catch (error) {
    console.log("Could not fetch keys, is your node online? Execute 'cudo node status' for more info")
  }
}

const add = async function (argv) {
  try {
    addAccountNode(argv.name)
  } catch (error) {
    throw new VError(`Could not add account ${argv.name}, \nError: ${error.message}`)
  }
}

const rm = async function (argv) {
  try {
    deleteAccountNode(argv.name, argv.yes)
  } catch (error) {
    throw new VError(`Cannot remove account ${argv.name}. \nError: ${error.message}`)
  }
}

const fund = async function (argv) {
  try {
    fundAccountNode(argv.name, argv.tokens)
  } catch (error) {
    throw new VError(`Cannot fund account ${argv.name}. \nError: ${error.message}`)
  }
}

exports.command = 'keys'
exports.describe = 'Manage accounts/keys'

exports.builder = (yargs) => {
  yargs.command('add <name>', 'Add account to the node key storage', () => {
    yargs.positional('name', {
      type: 'string',
      describe: 'account name'
    })
  }, add)
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
    }, fund)
    .command('ls', 'List all accounts in the node key storage', () => {}, list)
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
    }, rm)
    .demandCommand(1, 'No command specified!') // user must specify atleast one command
}
