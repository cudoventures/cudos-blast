const {
  CosmWasmClient,
  DirectSecp256k1HdWallet,
  SigningCosmWasmClient
} = require('cudosjs')
const { getAddressPrefix } = require('../utilities/config-utils')
const { getAccounts } = require('../utilities/account-utils')
const BlastError = require('./blast-error')

async function getSigner(nodeUrl, mnemonic) {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: getAddressPrefix() })
  const signer = await SigningCosmWasmClient.connectWithSigner(nodeUrl, wallet)
  const address = (await wallet.getAccounts())[0].address
  signer.address = address
  return signer
}

async function getDefaultLocalSigner(nodeUrl) {
  return getSigner(nodeUrl, getAccounts()[0].mnemonic)
}

async function getContractInfo(nodeUrl, contractAddress) {
  const client = await CosmWasmClient.connect(nodeUrl)
  try {
    return client.getContract(contractAddress)
  } catch (error) {
    throw new BlastError(`Failed to get contract info from address: ${contractAddress}. Error: ${error.message}`)
  }
}

async function getCodeDetails(nodeUrl, codeId) {
  const client = await CosmWasmClient.connect(nodeUrl)
  return client.getCodeDetails(codeId)
}

module.exports = {
  getSigner: getSigner,
  getDefaultLocalSigner: getDefaultLocalSigner,
  getContractInfo: getContractInfo,
  getCodeDetails: getCodeDetails
}
