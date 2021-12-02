const fs = require('fs')
const VError = require('verror')
const {
  spawnSync
} = require('child_process')

const {
  getDockerComposeInitFile,
  getDockerComposeStartFile,
  getProjectRootPath
} = require('./packageInfo')

const optimizerVer = '0.12.3'

const cudosNodeHomeDir = './cudos_data/node'

const dockerComposeCmd = `docker-compose -f ${getDockerComposeStartFile()} -f ${getDockerComposeInitFile()} `
const nodeCmd = 'exec -T cudos-node cudos-noded '
const starportCmd = `exec -T cudos-node starport --home ${cudosNodeHomeDir} `

const doDocker = function (cmd) {
  const childResult = spawnSync(cmd, {
    stdio: 'inherit',
    shell: true
  })
  if (childResult.status !== 0) {
    console.log('Command to the local node failed!')
  }
}

const execute = function (arg) {
  const cmd = dockerComposeCmd + arg
  doDocker(cmd)
}

const executeNode = function (arg) {
  execute(nodeCmd + arg)
}

const executeStarport = function (arg) {
  execute(starportCmd + arg)
}

const stopNode = function () {
  execute(' down')
}

const startNode = function (inBackground) {
  if (inBackground) {
    execute(' up --build -d')
  } else {
    execute(' up --build')
  }
}

const keysListNode = function () {
  executeNode('keys list')
}

const fundAccount = function (address, tokens) {
  executeStarport(`chain faucet ${address} ${tokens}`)
}

const compile = function () {
  const projectRootPath = getProjectRootPath()
  const compileCmd = `docker run --rm -v "${projectRootPath}":/code  --mount type=volume,source="contracts_cache",target=/code/target  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cosmwasm/workspace-optimizer:${optimizerVer}`

  console.log(`${projectRootPath}/contracts`)
  if (!fs.existsSync(`${projectRootPath}/contracts`)) {
    throw new VError('No contracts folder found! Make sure to place your smart contracts in /contracts.')
  }
  doDocker(compileCmd)
}

module.exports = {
  stopNode: stopNode,
  startNode: startNode,
  keysListNode: keysListNode,
  fundAccount: fundAccount,
  compile: compile
}
