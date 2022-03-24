const path = require('path')
const { CudosContract } = require('./contract-utils')
const { getProjectRootPath } = require('./package-info')
const {
  DirectSecp256k1HdWallet,
  SigningCosmWasmClient,
  CosmWasmClient
} = require('cudosjs')
const {
  getNetwork,
  getAddressPrefix
} = require('./config-utils')

const nodeUrl = getNetwork(process.env.BLAST_NETWORK)
const accounts = getAccounts()
const addressPrefix = getAddressPrefix()

global.getSigners = async function() {
  const signers = []
  for (const acc of accounts) {
    signers.push(await getSigner(acc))
  }
  return signers
}

global.getContractFactory = async function(contractName) {
  return new CudosContract(contractName, await getSigner(accounts[0]))
}

global.getContractFromAddress = async function(contractAddress, signer = null) {
  const contractInfo = await getContractInfo(contractAddress)
  signer = signer ?? await getSigner(accounts[0])
  return new CudosContract(contractInfo.label, signer, contractAddress)
}

function getAccounts() {
  const accountsPath = path.join(getProjectRootPath(), 'accounts.json')
  return Object.values(require(accountsPath))
}

async function getContractInfo(contractAddress) {
  const client = await CosmWasmClient.connect(nodeUrl)
  return await client.getContract(contractAddress)
}

async function getSigner(acc) {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(acc.mnemonic, { prefix: addressPrefix })
  const signer = await SigningCosmWasmClient.connectWithSigner(nodeUrl, wallet)
  signer.address = acc.address
  return signer
}
