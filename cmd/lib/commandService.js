const fs = require('fs')
const { spawnSync } = require('child_process')
const { getDockerComposeFile, getDockerEnvFile, getProjectRootPath } = require('./packageInfo')

const optimizerVer = '0.11.5'

const cudosNodeHomeDir = './cudos_data/node'

const dockerComposeCmd = `docker-compose --env-file=${getDockerEnvFile()} -f ${getDockerComposeFile()} `

const nodeCmd = `exec -T cudos-node cudos-noded --home ${cudosNodeHomeDir} `
const starportCmd = `exec -T cudos-node starport --home ${cudosNodeHomeDir} `

const doDocker = function (cmd) {
  spawnSync(cmd, { stdio: 'inherit', shell: true })
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
  execute('down')
}

const startNode = function (inBackground) {
  if (inBackground) {
    execute('up -d')
  } else {
    execute('up')
  }
}

const statusNode = function () {
  executeNode('status')
}

const keysNode = function () {
  executeNode('keys list  --output json')
}

const fundAccount = function (address, tokens) {
  executeStarport(`chain faucet ${address} ${tokens}`)
}

const compile = function () {
  const projectRootPath = getProjectRootPath()
  const compileCmd = `docker run --rm -v "${projectRootPath}":/code  --mount type=volume,source="contracts_cache",target=/code/target  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cosmwasm/workspace-optimizer:${optimizerVer}`

  console.log(`${projectRootPath}/contracts`)
  if (!fs.existsSync(`${projectRootPath}/contracts`)) {
    throw new Error('No contracts folder found! Make sure to place your smart contracts in /contracts.')
  }
  doDocker(compileCmd)
}

module.exports = {
  stopNode: stopNode,
  startNode: startNode,
  statusNode: statusNode,
  keysNode: keysNode,
  fundAccount: fundAccount,
  compile: compile
}
