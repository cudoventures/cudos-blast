const fs = require('fs');
const {
    execSyncCmd
} = require("./lib");

const path = require('path');

function compileCmd(argv) {
    let optcmd = `docker run --rm -v "${process.env.PWD}/contracts/${argv.contractname}":/code  --mount type=volume,source="${argv.contractname}_cache",target=/code/target  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cosmwasm/rust-optimizer:0.11.3`

    if (!fs.existsSync(`${process.env.PWD}/contracts/${argv.contractname}`)) {
        console.log(`${argv.contractname} does not exist`);
        return
    }
    console.log('compiling...');
    const r = execSyncCmd(optcmd);
    console.log(String(r));
}

module.exports.compileCmd = compileCmd;