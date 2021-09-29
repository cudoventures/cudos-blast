const prompt = require('prompt')

const { keystore, commandService } = require('./lib')

const list = async function () {
  try {
    const accs = await keystore.listWithBalance()
    console.log(accs)
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      const accs = await keystore.list()
      console.log(accs)
    } else {
      console.log(err.message)
    }
  }
}

const rm = async function (argv) {
  const name = argv.name
  if (argv.yes) {
    await keystore.removeAccount(name)
  } else {
    prompt.start()
    console.log(`Are you sure you want to delete ${argv.name} from the keystore? y/n`)
    const { answer } = await prompt.get(['answer'])
    if (answer === 'y') {
      await keystore.removeAccount(name)
    }
  }
}

const add = async function (argv) {
  const acc = await keystore.createNewAccount(argv.name)
  console.log(`Account ${argv.name} is created. ${acc.address}`)
  console.log(`Keep the mnemonic in a secure location. This is the only way to recover your account.\n${acc.mnemonic}`)
}

const fund = async function (argv) {
  if (argv.name) {
    const addr = await keystore.getAccountAddress(argv.name)
    console.log(`fund user account ${argv.name} ==> ${addr}`)
    commandService.fundAccount(addr, argv.tokens)
  } else if (argv.address) {
    console.log('fund address')
    commandService.fundAccount(argv.address, argv.tokens)
  } else {
    console.log('Provide account name or cudos address.')
  }
}

exports.command = 'keys'
exports.describe = 'Manage keystore/accounts'

exports.builder = (yargs) => {
  yargs.command('add [name]', 'Add account to the keystore', () => {
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
      }),
      yargs.option('tokens', {
        alias: 't',
        type: 'string',
        required: true,
        describe: 'amount of tokens in the format 10000000acudos'
      })
    }, fund)
    .command('ls', 'List all accounts in the keystore', () => { }, list)
    .command('rm [name]', 'Remove account from the keystore', () => {
      yargs.positional('name', {
        type: 'string',
        describe: 'account name'
      }),
      yargs.option('yes', {
        alias: 'y',
        type: 'boolean',
        default: false,
        description: 'Ignore the prompt.'
      })
    }, rm)
}
