const fs = require('fs')
const vm = require('vm')
const path = require('path')

const { getContractFactory, getContractFromAddress } = require('./lib/contract')

global.getContractFactory = getContractFactory
global.getContractFromAddress = getContractFromAddress

async function runCmd (argv) {
  if (!fs.existsSync(`${path.resolve('.')}/${argv.scriptFilePath}`)) {
    console.log(`Script at location ${path.resolve('.')}/${argv.scriptFilePath} does not exist. Execute cudo run --help for more info.`)
    return
  }

  const ds = new vm.Script(fs.readFileSync(argv.scriptFilePath))
  await ds.runInThisContext()
}

module.exports.runCmd = runCmd
