const VError = require('verror')

const {
  keysListNode,
  addAccountNode,
  deleteAccountNode
} = require('./lib/commandService')

const {
  keystore,
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
  if (argv.name) {
    const addr = await keystore.getAccountAddress(argv.name)
    console.log(`fund user account ${argv.name} ==> ${addr}`)
    await client.faucetSendTo(addr, argv.tokens)
  } else if (argv.address) {
    console.log('fund address')
    await client.faucetSendTo(argv.address, argv.tokens)
  } else {
    console.log('Provide account name or cudos address.')
  }
}

exports.command = 'keys'
exports.describe = 'Manage accounts/keys'

exports.builder = (yargs) => {
  yargs.command('add [name]', 'Add account to the node key storage', () => {
    yargs.positional('name', {
      type: 'string',
      describe: 'account name'
    })
  }, add)
    .command('fund [name]', 'Fund tokens', () => {
      yargs.positional('name', {
        type: 'string',
        describe: 'account name'
      })
      yargs.option('address', {
        alias: 'a',
        type: 'string',
        describe: 'address'
      })
      yargs.option('tokens', {
        alias: 't',
        type: 'string',
        required: true,
        describe: 'amount of tokens in the format 10000000ucudos'
      })
    }, fund)
    .command('ls', 'List all accounts in the keystore', () => {}, list)
    .command('rm [name]', 'Remove account from the node key storage', () => {
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
