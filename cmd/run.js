const process = require('process');

const path = require('path')

//consit SCRIPT_FILE = path.join(process.cwd(), 'script-deploy.js');

const fs = require('fs');
const vm = require('vm');


const {getContractFactory} = require('./lib/contract');

global.getContractFactory = getContractFactory;

async function deployCmd(argv) {


    const ds = new vm.Script(fs.readFileSync(SCRIPT_FILE));
    await ds.runInThisContext();
}

module.exports.runCmd = runCmd;
