#!/usr/bin/env node

const {
    execSync
} = require("child_process");

const path = require('path');
const fs = require('fs')

require('yargs')
    .scriptName("cudo")
    .usage('$0 <cmd> [args]')
    .command('init [contractname]', 'init smart contract template', (yargs) => {
        yargs.positional('contractname', {
            type: 'string',
            default: 'contract1',
            describe: 'smart contract name'
        })
    }, function(argv) {
        if (fs.existsSync(argv.contractname)) {
            console.log(`${argv.contractname} exists`);
            return
        }

        execSync(`cp -r template ${argv.contractname}`);
        console.log('Done.');
    })
    .command('compile [contractname]', 'compile smart contract', (yargs) => {
        yargs.positional('contractname', {
            type: 'string',
            default: 'contract1',
            describe: 'smart contract name'
        })
    }, function(argv) {
        if (!fs.existsSync(argv.contractname)) {
            console.log(`${argv.contractname} does not exist`);
            return
        }
        // temporary solution before uploading our dockerimage to the Hub
        try {
            execSync("docker inspect cudo/rust-wasm").toString('utf-8');
        } catch (e) {
            execSync("docker build -f rust-wasm.Dockerfile --tag cudo/rust-wasm .").toString('utf-8');
        }

        execSync(`docker run --rm -v "${process.env.PWD}/${argv.contractname}":/code --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cudo/rust-wasm`).toString('utf-8');
        console.log("Compiled.");
    })
    .help()
    .argv
