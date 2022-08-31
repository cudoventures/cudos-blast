const {
  CosmWasmClient,
  DirectSecp256k1HdWallet,
  SigningCosmWasmClient,
  GasPrice
} = require('cudosjs')
const { LOCAL_NETWORK } = require('../config/blast-constants')
const {
  getNetwork,
  getAddressPrefix,
  getGasPrice
} = require('./config-utils')
const {
  getLocalAccounts,
  getPrivateAccounts
} = require('./account-utils')
const { checkNodeOnline } = require('./get-node-status')
const BlastError = require('./blast-error')

const nodeUrl = getNetwork(process.env.BLAST_NETWORK)

async function getSigner(mnemonic) {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: getAddressPrefix() })
  await checkNodeOnline(process.env.BLAST_NETWORK)
  // gasPrice in signing client is considered only when auto gas is used
  const signer = await SigningCosmWasmClient.connectWithSigner(
    nodeUrl, wallet, { gasPrice: GasPrice.fromString(getGasPrice()) })
  const address = (await wallet.getAccounts())[0].address
  signer.address = address
  return signer
}

async function getDefaultSigner() {
  const accounts = getAccounts(nodeUrl)
  if (!accounts[0]) {
    throw new BlastError('Cannot get default signer. First account from accounts file is missing')
  }
  await checkNodeOnline(process.env.BLAST_NETWORK)
  return getSigner(accounts[0].mnemonic)
}

function getAccounts() {
  return (nodeUrl === LOCAL_NETWORK ? getLocalAccounts() : getPrivateAccounts())
}

async function getContractInfo(contractAddress) {
  await checkNodeOnline(process.env.BLAST_NETWORK)
  const client = await CosmWasmClient.connect(nodeUrl)
  try {
    return client.getContract(contractAddress)
  } catch (error) {
    throw new BlastError(`Failed to get contract info from address: ${contractAddress}. Error: ${error.message}`)
  }
}

async function getCodeDetails(codeId) {
  await checkNodeOnline(process.env.BLAST_NETWORK)
  const client = await CosmWasmClient.connect(nodeUrl)
  return client.getCodeDetails(codeId)
}

module.exports = {
  getSigner: getSigner,
  getDefaultSigner: getDefaultSigner,
  getAccounts: getAccounts,
  getContractInfo: getContractInfo,
  getCodeDetails: getCodeDetails
}
