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
        // will be replaced with bundled version of the contract template
        execSync("cargo install cargo-generate --features vendored-openssl").toString('utf-8');
        execSync(`cargo generate --git https://github.com/CosmWasm/cosmwasm-template.git --name ${argv.contractname}`).toString('utf-8');
    })
    .command('compile [contractname]', 'compile smart contract', (yargs) => {
        yargs.positional('contractname', {
            type: 'string',
            default: 'contract1',
            describe: 'smart contract name'
        })
    }, function(argv) {
        execSync(`docker run --rm -v "${process.env.PWD}/${argv.contractname}":/code --mount type=volume,source="${path.basename(process.env.PWD)}_cache",target=/code/target --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry  cosmwasm/rust-optimizer:0.11.4`).toString('utf-8');
    })
    .help()
    .argv
