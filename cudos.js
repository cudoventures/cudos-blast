#!/usr/bin/env node

const yargs = require('yargs');
const {
    hideBin
} = require('yargs/helpers');

const {
    initCmd,
    compileCmd,
    runCmd,
    testCmd,
    unitTestCmd,
} = require("./cmd");

const nodeCmd = require('./cmd/node');
const keysCmd = require('./cmd/keys');

async function main() {

    await yargs(hideBin(process.argv))
        .scriptName("cudos")
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
        .command('compile',
            'Compiles in alphabetical order the smart contracts in the workspace',
            (yargs) => {
                yargs
                    .option('name', {
                        alias: 'n',
                        type: 'string',
                        default: 'contracts',
                        description: 'contracts folder name'
                    })
            },
            compileCmd)
        .command(nodeCmd)
        .command('run <scriptFilePath>', 'run script', (yargs) => {
            yargs.positional('scriptFilePath', {
                type: 'string',
                describe: 'The path to to the script to run',
            })
        }, runCmd)
        .command('test',
            'run integration tests',
            (yargs) => { },
            testCmd)
        .command('unittest',
            'runs the unit tests of the smart contracts',
            (yargs) => { },
            unitTestCmd)
        .command(keysCmd)
        .demandCommand(1, "No command specified!") // user must specify atleast one command 
        .recommendCommands()
        .strictCommands() // checks if the command is specified, if its not - user friendly error
        .showHelpOnFail(true) // show help automatically
        .help()
        .argv
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(`${error}`);
        process.exit(1);
    });
