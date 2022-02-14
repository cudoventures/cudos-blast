const {
  executeCompose,
  executeAttach
} = require('../../blast-utilities/run-docker-commands')
const {
  getNodeStatus,
  checkNodeOnline,
  checkNodeOffline
} = require('../../blast-utilities/get-node-status')
const { getAdditionalAccounts } = require('../../blast-utilities/config-utils')
const { handleAdditionalAccountCreation } = require('../../blast-utilities/account-utils')
const { delay } = require('../../blast-utilities/blast-helper')
const BlastError = require('../../blast-utilities/blast-error')

const startNodeCmd = async function(argv) {
  await checkNodeOffline()

  executeCompose('up --build -d')

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
  // We need the first block to be mined in order to add a new key.
  // In order to wait the first block to be mined we have to wait additional ±4 seconds after the nodeStatus is true.
  await delay(4)

  const additionalAccounts = getAdditionalAccounts()
  if (additionalAccounts > 0) {
    await handleAdditionalAccountCreation(additionalAccounts)
  }

  if (!argv.daemon) {
    executeAttach()
  }
}

const stopNodeCmd = async function() {
  await checkNodeOnline()
  executeCompose('down')
}

const nodeStatusCmd = async function() {
  const nodeStatus = await getNodeStatus()
  console.log(nodeStatus.info)
}

module.exports = {
  startNodeCmd: startNodeCmd,
  stopNodeCmd: stopNodeCmd,
  nodeStatusCmd: nodeStatusCmd
}
