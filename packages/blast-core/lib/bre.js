const { CudosContract } = require('./cudos-contract')
const {
  getSigner,
  getDefaultSigner,
  getAccounts,
  getContractInfo
} = require('../utilities/network-utils')

// For the local node: returns an array of predefined local accounts including the auto generated additional accounts
// For other networks: returns an array of user-defined private accounts from private-accounts.json
globalThis.bre.getSigners = async function() {
  const accounts = getAccounts()
  const signers = []
  for (const acc of accounts) {
    signers.push(await getSigner(acc.mnemonic))
  }
  return signers
}

// Returns an instance of a new contract by its label
globalThis.bre.getContractFactory = async function(contractLabel) {
  return new CudosContract(contractLabel)
}

// Returns an instance of an existing contract by its address. A custom signer can be set.
globalThis.bre.getContractFromAddress = async function(contractAddress, signer = null) {
  const contractInfo = await getContractInfo(contractAddress)
  signer = signer ?? await getDefaultSigner()
  return new CudosContract(contractInfo.label, signer, contractAddress)
}

module.exports = globalThis.bre
