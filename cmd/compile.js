const fs = require('fs');
const {
    execSyncCmd
} = require("./lib");

const path = require('path');

function compileCmd(argv) {

    if (!fs.existsSync(`${path.resolve('.')}/Cargo.toml`)) {
        console.log(`No Cargo.toml found, are you calling this command from the root of your project? Execute cudo compile --help for more info.`);
        return
    }

    let optcmd = `docker run --rm -v "${path.resolve('.')}":/code  --mount type=volume,source="contracts_cache",target=/code/target  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cosmwasm/workspace-optimizer:0.11.3`

    console.log('compiling...');
    const r = execSyncCmd(optcmd, { stdio: 'inherit' });
    console.log(String(r));
    console.log('compilation finished');

}

module.exports.compileCmd = compileCmd;