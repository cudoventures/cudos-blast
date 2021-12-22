#!/usr/bin/env node

const yargs = require('yargs')
const {
  hideBin
} = require('yargs/helpers')
const commands = require('./commands')

// TODO: refactor
const nodeCmd = require('../../cmd/node')

async function main() {
  await yargs(hideBin(process.argv))
    .scriptName('cudos')
    .version()
    .usage('$0 <cmd> [args]')
    .command(commands.initInfo)
    .command(commands.compileInfo)
    .command(commands.testInfo)
    .command(commands.unitTestInfo)
    .command(nodeCmd)
    .command(commands.runInfo)
    .command(commands.keysInfo)
    .demandCommand(1, 'No command specified!') // user must specify atleast one command
    .recommendCommands()
    .strictCommands() // checks if the command is specified, if its not - user friendly error
    .showHelpOnFail(true) // show help automatically
    .help()
    .argv
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(`${error}`)
    process.exit(1)
  })
