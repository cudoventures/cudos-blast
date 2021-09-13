const process = require('process');

const fs = require('fs');
const vm = require('vm');

const { getContractFactory, getContractFromAddress } = require('./lib/contract');

global.getContractFactory = getContractFactory;
global.getContractFromAddress = getContractFromAddress;

async function runCmd(argv) {

    if (argv.scriptFilePath === undefined || argv.scriptFilePath === '') {
        console.error("You must specify a scriptfile path to run. Execute cudo run --help for more info")
        return;
    }
    if (!fs.existsSync(`${process.env.PWD}/${argv.scriptfile}`)) {
        console.log(`Script at location ${argv.scriptFilePath} does not exist. Execute cudo run --help for more info.`);
        return;
    }

    const ds = new vm.Script(fs.readFileSync(argv.scriptfile));
    await ds.runInThisContext();
}

module.exports.runCmd = runCmd;
