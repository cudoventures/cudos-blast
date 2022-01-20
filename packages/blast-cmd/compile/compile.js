const fs = require('fs')
const { executeRun } = require('../../blast-utilities/run-docker-commands')
const { getProjectRootPath } = require('../../blast-utilities/package-info')
const BlastError = require('../../blast-utilities/blast-error')

const OPTIMIZER_VER = '0.12.3'

function compileCmd(argv) {
  const projectRootPath = getProjectRootPath()
  const compileCmd = `-v "${projectRootPath}":/code  --mount type=volume,source="contracts_cache",target=/code/target` +
    ' --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry' +
    ` cosmwasm/workspace-optimizer:${OPTIMIZER_VER}`

  if (!fs.existsSync(`${projectRootPath}/contracts`)) {
    throw new BlastError('No contracts folder found! Make sure to place your smart contracts in /contracts.')
  }
  console.log(`Contracts path: ${projectRootPath}/contracts`)

  executeRun(compileCmd)
}

module.exports = { compileCmd: compileCmd }
