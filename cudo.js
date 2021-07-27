#!/usr/bin/env node

const yargs = require('yargs');
const {
    hideBin
} = require('yargs/helpers');

const {
    initCmd,
    compileCmd,
    deployCmd
} = require("./cmd");

const nodeCmd = require('./cmd/node');

(async function main() {

    await yargs(hideBin(process.argv))
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
        .command(nodeCmd)
        .command('deploy [contractname]', 'deploy smart contract', (yargs) => {
            yargs.positional('contractname', {
                type: 'string',
                default: 'contract1',
                describe: 'smart contract name'
            })
        }, deployCmd)
        .help()
        .argv
})();
