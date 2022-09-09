const fs = require('fs')
const path = require('path')
const BlastError = require('../../utilities/blast-error')

async function runCmd(argv) {
  if (!fs.existsSync(`${path.resolve('.')}/${argv.scriptFilePath}`)) {
    throw new BlastError(`Script at location ${path.resolve('.')}/${argv.scriptFilePath} does not exist.`)
  }
  // we pass the selected network to bre.js through process.env
  process.env.BLAST_NETWORK = argv.network ?? ''
  require('../../lib/bre')

  const runScript = require(`${path.resolve('.')}/${argv.scriptFilePath}`)

  return runScript.main()
}

module.exports = { runCmd: runCmd }
