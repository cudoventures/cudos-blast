#!/usr/bin/env node

const {
    execSync
} = require("child_process");

require('yargs')
    .scriptName("cudo")
    .usage('$0 <cmd> [args]')
    .command('init', 'init cudo project', (yargs) => {
        yargs.positional('contractname', {
            type: 'string',
            default: 'wasm-start',
            describe: 'the name of the cosmwasm smart contract project'
        })
    }, function(argv) {
        execSync("cargo install cargo-generate --features vendored-openssl").toString('utf-8');
        execSync("cargo generate --git https://github.com/CosmWasm/cosmwasm-template.git --name " + argv.contractname).toString('utf-8');
    })
    .help()
    .argv
