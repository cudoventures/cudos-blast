const { SigningCosmWasmClient } = require('cudosjs')

const {
  getEndpoint,
  getNetwork,
  getDefaultAccount
} = require('./config-utils.js')

const { getSigner } = require('./account-utils')

let client

async function setClient(accountName, network) {
  if (!accountName) {
    accountName = await getDefaultAccount()
  }
  if (!network) {
    network = await getNetwork()
  }

  const endpoint = await getEndpoint()
  const wallet = await getSigner(accountName, network)
  client = await SigningCosmWasmClient.connectWithSigner(endpoint, wallet)
  client.name = accountName
}

function getClient() {
  return client
}

module.exports = {
  setClient: setClient,
  getClient: getClient
}
