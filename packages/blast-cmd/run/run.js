const fs = require('fs')
const vm = require('vm')
const path = require('path')
const BlastError = require('../../blast-utilities/blast-error')
const { checkNodeOnline } = require('../../blast-utilities/get-node-status')

async function runCmd(argv) {
  if (!fs.existsSync(`${path.resolve('.')}/${argv.scriptFilePath}`)) {
    throw new BlastError(`Script at location ${path.resolve('.')}/${argv.scriptFilePath} does not exist.`)
  }
  await checkNodeOnline()
  require('../../blast-utilities/global-functions')
  const ds = new vm.Script(fs.readFileSync(argv.scriptFilePath))
  return ds.runInThisContext()
}

module.exports = { runCmd: runCmd }
