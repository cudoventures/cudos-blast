const fs = require('fs');
const {
    execSyncCmd
} = require("./lib");

const path = require('path');

function compileCmd(argv) {
    let optcmd = `docker run --rm -v "${process.env.PWD}/contracts/${argv.contractname}":/code  --mount type=volume,source="${argv.contractname}_cache",target=/code/target  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cosmwasm/rust-optimizer:0.11.3`

    if (argv.contractname === undefined || argv.contractname === '') {
        console.error("You must specify a contract to compile! Execute cudo compile --help for more info.");
        return;
    }
    if (!fs.existsSync(`${process.env.PWD}/contracts/${argv.contractname}`)) {
        console.log(`Contract with name: ${argv.contractname} does not exist. Execute cudo compile --help for more info.`);
        return
    }
    console.log('compiling...');
    const r = execSyncCmd(optcmd);
    console.log(String(r));
}

module.exports.compileCmd = compileCmd;