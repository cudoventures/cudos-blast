const fs = require('fs')
const vm = require('vm')
const path = require('path')
const BlastError = require('../../utilities/blast-error')
const { checkNodeOnline } = require('../../utilities/get-node-status')

async function runCmd(argv) {
  if (!fs.existsSync(`${path.resolve('.')}/${argv.scriptFilePath}`)) {
    throw new BlastError(`Script at location ${path.resolve('.')}/${argv.scriptFilePath} does not exist.`)
  }
  await checkNodeOnline(argv.network)
  // we pass the selected network to globals.js through process.env
  process.env.BLAST_NETWORK = argv.network ?? ''
  require('../../utilities/globals')

  // const blastPath = `${path.resolve('.')}/blast.config.js`
  // if (!fs.existsSync(blastPath)) {
  //   throw new BlastError(`blast.config.js at location ${blastPath} does not exist.`)
  // }
  // require(blastPath)

  const ds = new vm.Script(fs.readFileSync(argv.scriptFilePath))
  return ds.runInThisContext()
}

module.exports = { runCmd: runCmd }
