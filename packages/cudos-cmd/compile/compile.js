const fs = require('fs')
const VError = require('verror')
const { executeRun } = require('../../cudos-utilities/run-docker-commands')
const { getProjectRootPath } = require('../../cudos-utilities/package-info')

let OPTIMIZER_VER = '0.12.3'

function compileCmd(argv) {
  if (argv.optimizer) {
    OPTIMIZER_VER = argv.optimizer
  }
  try {
    const projectRootPath = getProjectRootPath()
    const compileCmd = `-v "${projectRootPath}":/code  --mount type=volume,source="contracts_cache",target=/code/target` +
      ' --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry' +
      ` cosmwasm/workspace-optimizer:${OPTIMIZER_VER}`

    if (!fs.existsSync(`${projectRootPath}/contracts`)) {
      throw new VError('No contracts folder found! Make sure to place your smart contracts in /contracts.')
    }
    console.log(`Contracts path: ${projectRootPath}/contracts`)

    executeRun(compileCmd)
  } catch (e) {
    console.error(`${e}`)
    console.log('Execute cudo compile --help for more info.')
  }
}

module.exports = { compileCmd: compileCmd }
