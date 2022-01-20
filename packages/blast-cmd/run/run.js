const fs = require('fs')
const vm = require('vm')
const path = require('path')

const {
  getContractFactory,
  getContractFromAddress
} = require('../../blast-utilities/contract-utils')
const BlastError = require('../../blast-utilities/blast-error')

global.getContractFactory = getContractFactory
global.getContractFromAddress = getContractFromAddress

async function runCmd(argv) {
  if (!fs.existsSync(`${path.resolve('.')}/${argv.scriptFilePath}`)) {
    throw new BlastError(`Script at location ${path.resolve('.')}/${argv.scriptFilePath} does not exist.`)
  }
  const ds = new vm.Script(fs.readFileSync(argv.scriptFilePath))
  return ds.runInThisContext()
}

module.exports = { runCmd: runCmd }
