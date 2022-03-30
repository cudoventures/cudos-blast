const fs = require('fs')
const path = require('path')
const BlastError = require('../../blast-utilities/blast-error')
const { checkNodeOnline } = require('../../blast-utilities/get-node-status')

async function runCmd(argv) {
  if (!fs.existsSync(`${path.resolve('.')}/${argv.scriptFilePath}`)) {
    throw new BlastError(`Script at location ${path.resolve('.')}/${argv.scriptFilePath} does not exist.`)
  }
  await checkNodeOnline(argv.network)
  // we pass the selected network to globals.js through process.env
  process.env.BLAST_NETWORK = argv.network ?? ''
  require('../../blast-utilities/globals')

  const ds = require(`${path.resolve('.')}/${argv.scriptFilePath}`)

  return ds.main()
}

module.exports = { runCmd: runCmd }
