const fs = require('fs');
const {
    execSyncCmd
} = require("./lib");

const path = require('path');

function compileCmd(argv) {

    if (argv.contractsFolderName === undefined || argv.contractsFolderName === '') {
        console.error("You must specify a contracts folder to compile! Execute cudo compile --help for more info.");
        return;
    }

    if (!fs.existsSync(`${path.resolve('.')}/workspace/${argv.contractsFolderName}`)) {
        console.log(`Contracts folder with name: ${argv.contractsFolderName} does not exist. Execute cudo compile --help for more info.`);
        return
    }

    let optcmd = `docker run --rm -v "${path.resolve('.')}/workspace/":/code  --mount type=volume,source="${argv.contractsFolderName}_cache",target=/code/target  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cosmwasm/workspace-optimizer:0.11.3`

    console.log('compiling...');
    const r = execSyncCmd(optcmd, { stdio: 'inherit' });
    console.log(String(r));
    console.log('compilation finished');

}

module.exports.compileCmd = compileCmd;