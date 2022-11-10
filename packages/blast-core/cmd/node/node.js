const {
  executeCompose,
  executeComposeAsync,
  checkDockerStatus,
  executeNodeMultiCmd
} = require('../../utilities/run-docker-commands')
const {
  getNodeStatus,
  checkNodeOnline,
  checkNodeOffline
} = require('../../utilities/get-node-status')
const {
  generateRandomAccount,
  createLocalAccountsFile
} = require('../../utilities/account-utils')
const {
  getAdditionalAccounts,
  getAdditionalAccountsBalances,
  getAddressPrefix
} = require('../../utilities/config-utils')
const {
  delay,
  transferTokensByNameCommand
} = require('../../utilities/blast-helper')
const BlastError = require('../../utilities/blast-error')

const startNodeCmd = async function(argv) {
  checkDockerStatus()
  await checkNodeOffline()

  if (!argv.logs) {
    executeCompose('up --build -d')
  } else {
    executeComposeAsync('up --build')
  }
  await waitForRunningNode()
  console.log('Cudos Blast local node is ready')

  const additionalAccounts = await addAdditionalAccountsToNode()

  // get all local accounts by merging default with additional ones
  let localAccounts = require('../../config/default-accounts.json')
  localAccounts = {
    ...localAccounts,
    ...additionalAccounts
  }

  createLocalAccountsFile(localAccounts)
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

async function addAdditionalAccountsToNode() {
  const numberOfAdditionalAccounts = getAdditionalAccounts()
  const additionalAccounts = {}
  if (numberOfAdditionalAccounts > 0) {
    const customBalance = getAdditionalAccountsBalances()
    const addressPrefix = getAddressPrefix()
    for (let i = 1; i <= numberOfAdditionalAccounts; i++) {
      additionalAccounts[`account${10 + i}`] = await generateRandomAccount(addressPrefix)

      // add new account from mnemonic to the local node and fund it
      executeNodeMultiCmd(
        `echo ${additionalAccounts[`account${10 + i}`].mnemonic} | ` +
        `cudos-noded keys add account${10 + i} --recover --keyring-backend test && ` +
        transferTokensByNameCommand('faucet', `account${10 + i}`, `${customBalance}`)
      )
    }
  }
  return additionalAccounts
}

module.exports = {
  startNodeCmd: startNodeCmd,
  stopNodeCmd: stopNodeCmd,
  nodeStatusCmd: nodeStatusCmd
}
