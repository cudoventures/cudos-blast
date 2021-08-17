#!/usr/bin/env node

const yargs = require('yargs');
const {
    hideBin
} = require('yargs/helpers');

const {
    initCmd,
    compileCmd,
    runCmd
} = require("./cmd");

const nodeCmd = require('./cmd/node');

async function main() {

    await yargs(hideBin(process.argv))
        .scriptName("cudo")
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
        .command('compile [contractname]', 'compile smart contract', (yargs) => {
            yargs.positional('contractname', {
                type: 'string',
                default: 'contract1',
                describe: 'smart contract name'
            })
        }, compileCmd)
        .command(nodeCmd)
        .command('run [scriptPath]', 'run script', (yargs) => {
            yargs.positional('scriptPath', {
                type: 'string',
                describe: 'path to script',
            })
        }, runCmd)
        .help()
        .argv
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
