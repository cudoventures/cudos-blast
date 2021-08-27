const process = require('process');

const path = require('path')

const fs = require('fs');
const vm = require('vm');

const {getContractFactory, getContractFromAddress} = require('./lib/contract');

global.getContractFactory = getContractFactory;
global.getContractFromAddress = getContractFromAddress;

async function runCmd(argv) {

    const ds = new vm.Script(fs.readFileSync(argv.scriptfile));
    await ds.runInThisContext();
}

module.exports.runCmd = runCmd;
