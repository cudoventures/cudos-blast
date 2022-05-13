const { CudosContract } = require('./contract-utils')
const {
  DirectSecp256k1HdWallet,
  SigningCosmWasmClient,
  CosmWasmClient
} = require('cudosjs')
const {
  getNetwork,
  getAddressPrefix
} = require('./config-utils')
const {
  getAccounts,
  getPrivateAccounts
} = require('./account-utils')

const nodeUrl = getNetwork(process.env.BLAST_NETWORK)
const accounts = getAccounts()
const addressPrefix = getAddressPrefix()

// Returns an array of predefined accounts including the auto generated additional accounts
global.getSigners = async function() {
  const signers = []
  for (const acc of accounts) {
    signers.push(await getSigner(acc))
  }
  return signers
}

// Returns a single signer when private account name is passed. Otherwise, return object with all parsed accounts.
global.getCustomSigners = async function(privateAccountName) {
  const privateAccounts = getPrivateAccounts()
  if (privateAccountName) {
    return await getSigner(privateAccounts[privateAccountName])
  }
  const signers = {}
  for (const accountProperty in privateAccounts) {
    signers[accountProperty] = await getSigner(privateAccounts[accountProperty])
  }
  return signers
}

// Returns an instance of a new contract by its label. A custom signer can be set.
global.getContractFactory = async function(contractLabel, signer = null) {
  signer = signer ?? await getSigner(accounts[0])
  return new CudosContract(contractLabel, signer)
}

// Returns an instance of an existing contract by its address. A custom signer can be set.
global.getContractFromAddress = async function(contractAddress, signer = null) {
  const contractInfo = await getContractInfo(contractAddress)
  signer = signer ?? await getSigner(accounts[0])
  return new CudosContract(contractInfo.label, signer, contractAddress)
}

async function getContractInfo(contractAddress) {
  const client = await CosmWasmClient.connect(nodeUrl)
  return await client.getContract(contractAddress)
}

async function getSigner(account) {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(account.mnemonic, { prefix: addressPrefix })
  const signer = await SigningCosmWasmClient.connectWithSigner(nodeUrl, wallet)
  const address = (await wallet.getAccounts())[0].address
  signer.address = address
  return signer
}
