const fs = require('fs')
const { executeRun } = require('../../utilities/run-docker-commands')
const { getProjectRootPath } = require('../../utilities/package-info')
const { getRustOptimizerVersion } = require('../../utilities/config-utils')
const BlastError = require('../../utilities/blast-error')

function compileCmd(argv) {
  const optimizerVer = getRustOptimizerVersion()
  const projectRootPath = getProjectRootPath()
  const compileCmd = `-v "${projectRootPath}":/code -v "$HOME/.cargo/registry/":/usr/local/cargo/registry` +
    ` cosmwasm/workspace-optimizer:${optimizerVer}`

  if (!fs.existsSync(`${projectRootPath}/contracts`)) {
    throw new BlastError('No contracts folder found! Make sure to place your smart contracts in /contracts.')
  }
  console.log(`Compiling contracts at: "${projectRootPath}/contracts" with ${optimizerVer} version`)

  executeRun(compileCmd)
}

module.exports = { compileCmd: compileCmd }
