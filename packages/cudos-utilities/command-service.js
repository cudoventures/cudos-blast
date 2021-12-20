// TODO: remove this file when done refactoring

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

const dockerComposeCmd = `docker-compose -f ${getDockerComposeStartFile()} -f ${getDockerComposeInitFile()} `
const nodeCmd = 'exec cudos-node cudos-noded '
const nodeMultiCmd = 'exec cudos-node sh -c '

const doDocker = function(cmd) {
  const childResult = spawnSync(cmd, {
    stdio: 'inherit',
    shell: true
  })
  if (childResult.status !== 0) {
    console.log('Command to the local node failed!')
  }
}

const execute = function(arg) {
  const cmd = dockerComposeCmd + arg
  doDocker(cmd)
}

const executeNode = function(arg) {
  execute(nodeCmd + arg)
}

const MultiExecuteNode = function(arg) {
  execute(nodeMultiCmd + `'${arg}'`)
}

const stopNode = function() {
  execute(' down')
}

const startNode = function(inBackground) {
  if (inBackground) {
    execute(' up --build -d')
  } else {
    execute(' up --build')
  }
}

const keysListNode = function() {
  executeNode('keys list')
}

const addAccountNode = function(name) {
  MultiExecuteNode(`cudos-noded keys add ${name} && ` + transferTokensByNameCommand('faucet', name, '1000000000000000000'))
}

const deleteAccountNode = function(name, confirm) {
  if (confirm) {
    executeNode(`keys delete ${name} --yes`)
  } else {
    executeNode(`keys delete ${name}`)
  }
}

const fundAccountNode = function(name, amount) {
  MultiExecuteNode(transferTokensByNameCommand('faucet', name, amount))
}

const compile = function() {
  const projectRootPath = getProjectRootPath()
  const compileCmd = `docker run --rm -v "${projectRootPath}":/code  --mount type=volume,source="contracts_cache",target=/code/target  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cosmwasm/workspace-optimizer:${optimizerVer}`

  console.log(`${projectRootPath}/contracts`)
  if (!fs.existsSync(`${projectRootPath}/contracts`)) {
    throw new VError('No contracts folder found! Make sure to place your smart contracts in /contracts.')
  }
  doDocker(compileCmd)
}

function transferTokensByNameCommand(fromName, toName, amount) {
  return `cudos-noded tx bank send ${fromName} $(cudos-noded keys show ${toName} -a) ${amount}acudos ` +
  '--chain-id cudos-network --yes'
}

module.exports = {
  stopNode: stopNode,
  startNode: startNode,
  keysListNode: keysListNode,
  addAccountNode: addAccountNode,
  deleteAccountNode: deleteAccountNode,
  fundAccountNode: fundAccountNode,
  compile: compile
}
