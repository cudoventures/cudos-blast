const { CudosContract } = require('./cudos-contract')
const { getNetwork } = require('../utilities/config-utils')
const {
  getAccounts,
  getPrivateAccounts
} = require('../utilities/account-utils')
const {
  getSigner,
  getDefaultLocalSigner,
  getContractInfo
} = require('../utilities/network-utils')

const nodeUrl = getNetwork(process.env.BLAST_NETWORK)

// Returns an array of predefined local accounts including the auto generated additional accounts
globalThis.bre.getSigners = async function() {
  const signers = []
  for (const acc of getAccounts()) {
    signers.push(await getSigner(nodeUrl, acc.mnemonic))
  }
  return signers
}

// Returns a single signer when private account name is passed. Otherwise, return object with all parsed accounts.
globalThis.bre.getCustomSigners = async function(privateAccountName) {
  const privateAccounts = getPrivateAccounts()
  if (privateAccountName) {
    return await getSigner(nodeUrl, privateAccounts[privateAccountName].mnemonic)
  }
  const signers = {}
  for (const accountProperty in privateAccounts) {
    signers[accountProperty] = await getSigner(nodeUrl, privateAccounts[accountProperty].mnemonic)
  }
  return signers
}

// Returns an instance of a new contract by its label
globalThis.bre.getContractFactory = async function(label) {
  return CudosContract.constructLocal(label)
}

// Returns an instance of a contract that is uploaded but not instantiated. A custom signer can be set.
globalThis.bre.getContractFromCodeId = async function(codeId, label, signer = null) {
  signer = signer ?? await getDefaultLocalSigner(nodeUrl)
  return CudosContract.constructUploaded(codeId, label, signer)
}

// Returns an instance of an existing contract by its address. A custom signer can be set.
globalThis.bre.getContractFromAddress = async function(contractAddress, signer = null) {
  const contractInfo = await getContractInfo(nodeUrl, contractAddress)
  signer = signer ?? await getDefaultLocalSigner(nodeUrl)
  return CudosContract.constructDeployed(contractInfo.label, contractInfo.codeId, contractAddress, signer)
}

// copy core functionality to global scope to avoid breaking changes
globalThis.getSigners = globalThis.bre.getSigners
globalThis.getCustomSigners = globalThis.bre.getCustomSigners
globalThis.getContractFactory = globalThis.bre.getContractFactory
globalThis.getContractFromAddress = globalThis.bre.getContractFromAddress

module.exports = globalThis.bre
