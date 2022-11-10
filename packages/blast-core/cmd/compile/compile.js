const fs = require('fs')
const {
  checkDockerStatus,
  executeRun
} = require('../../utilities/run-docker-commands')
const { getProjectRootPath } = require('../../utilities/package-info')
const { getRustOptimizerVersion } = require('../../utilities/config-utils')
const BlastError = require('../../utilities/blast-error')

function compileCmd(argv) {
  const optimizerVer = getRustOptimizerVersion()
  const projectRootPath = getProjectRootPath()
  const compileCmd = `-v "${projectRootPath}":/code  --mount type=volume,source="contracts_cache",target=/code/target` +
    ' --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry' +
    ` cosmwasm/workspace-optimizer:${optimizerVer}`

  checkDockerStatus()
  if (!fs.existsSync(`${projectRootPath}/contracts`)) {
    throw new BlastError('No contracts folder found! Make sure to place your smart contracts in /contracts.')
  }
  console.log(`Compiling contracts at: "${projectRootPath}/contracts" with ${optimizerVer} version`)

  executeRun(compileCmd)
}

module.exports = { compileCmd: compileCmd }
