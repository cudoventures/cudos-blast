const fs = require('fs');
const {
    execSyncCmd
} = require("./lib");

const path = require('path');

function compileCmd(argv) {

    if (!fs.existsSync(`${path.resolve('.')}/contracts`)) {
        console.log(`Contracts folder with name: ${argv.contractsFolderName} does not exist. Execute cudo compile --help for more info.`);
        return
    }

    let optcmd = `docker run --rm -v "${path.resolve('.')}/":/code  --mount type=volume,source="${argv.contractsFolderName}_cache",target=/code/target  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cosmwasm/workspace-optimizer:0.11.5`

    console.log('compiling...');
    const r = execSyncCmd(optcmd, { stdio: 'inherit' });
    console.log(String(r));
    console.log('compilation finished');

}

module.exports.compileCmd = compileCmd;