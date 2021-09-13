#!/usr/bin/env node

const yargs = require('yargs');
const {
    hideBin
} = require('yargs/helpers');

const {
    initCmd,
    compileCmd,
    runCmd,
    testCmd
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
                describe: 'The smart contract to compile name',
            })
        }, compileCmd)
        .command(nodeCmd)
        .command('run [scriptFilePath]', 'run script', (yargs) => {
            yargs.positional('scriptPath', {
                type: 'string',
                describe: 'The path to to the script to run',
            })
        }, runCmd)
        .command('test', 'run tests', (yargs) => { }, testCmd)
        .demandCommand(1, "No command specified!") // user must specify atleast one command 
        .recommendCommands()
        .strictCommands() // checks if the command is specified, if its not - user friendly error
        .showHelpOnFail(false, 'Specify --help for available options') // does not show help automatically, just tells the user that he can call --help for available options
        .help()
        .argv
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(`${error}`);
        process.exit(1);
    });