#!/usr/bin/env node

const {
    initCmd,
    compileCmd
} = require("./cmd");

require('yargs')
    .scriptName("cudo")
    .version()
    .usage('$0 <cmd> [args]')
    .command('init [contractname]', 'init smart contract template', (yargs) => {
        yargs.positional('contractname', {
                type: 'string',
                default: 'contract1',
                describe: 'smart contract name'
            })
            .option('dir', {
                alias: 'd',
                type: 'string',
                default: '.',
                description: 'smart contracs directory'
            })
    }, initCmd)
    .command('compile [contractname]', 'compile smart contract', (yargs) => {
        yargs.positional('contractname', {
            type: 'string',
            default: 'contract1',
            describe: 'smart contract name'
        })
    }, compileCmd)
    .help()
    .argv
