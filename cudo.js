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
        .command('compile [contractsFolderName]', 'Compiles in alphabetical order the smart contracts in the specified contracts folder(by default: workspace/contracts).', (yargs) => {
            yargs.positional('contractsFolderName', {
                type: 'string',
                default: 'contracts',
                describe: 'The folder in which the smart contracts are located',
            })

            //TODO - update readme and add below info + additional stuff making it more easy to understand
            // \n Please note that your contracts have to be in the[workspace] folder.\n If you decide to change the default name - you need to change the workspace Cargo.toml file to point to the your folder name.\n Example usage: cudo compile myContractsFolderName.
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