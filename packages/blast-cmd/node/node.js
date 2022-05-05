const {
  executeCompose,
  executeComposeAsync,
  checkDockerStatus
} = require('../../blast-utilities/run-docker-commands')
const {
  getNodeStatus,
  checkNodeOnline,
  checkNodeOffline
} = require('../../blast-utilities/get-node-status')
const { createLocalAccountsFile } = require('../../blast-utilities/account-utils')
const { delay } = require('../../blast-utilities/blast-helper')
const BlastError = require('../../blast-utilities/blast-error')

const startNodeCmd = async function(argv) {
  await checkDockerStatus()
  await checkNodeOffline()

  if (!argv.logs) {
    executeCompose('up --build -d')
  } else {
    executeComposeAsync('up --build')
  }
  await waitForRunningNode()
  console.log('Cudos Blast local node is ready')

  await createLocalAccountsFile()
  console.log('Local accounts information file created')
}

const stopNodeCmd = async function() {
  await checkNodeOnline()
  executeCompose('down')
}

const nodeStatusCmd = async function(argv) {
  const nodeStatus = await getNodeStatus(argv.network)
  console.log(nodeStatus.info)
}

async function waitForRunningNode() {
  let timeCounter = 0
  let nodeStatus = await getNodeStatus()

  while (!nodeStatus.isConnected) {
    await delay(2)
    nodeStatus = await getNodeStatus()
    timeCounter += 2
    if (timeCounter >= 60) {
      throw new BlastError('Failed to instantiate a node. Error: Timeout')
    }
  }
  // We need the first block to be mined so we can interact with the node.
  // In order to wait the first block to be mined we have to wait additional ±4 seconds after the nodeStatus is true.
  await delay(4)
}

module.exports = {
  startNodeCmd: startNodeCmd,
  stopNodeCmd: stopNodeCmd,
  nodeStatusCmd: nodeStatusCmd
}
