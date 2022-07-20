const { CudosContract } = require('./cudos-contract')
const {
  getSigner,
  getAccounts
} = require('../utilities/network-utils')
// const { assertRevert } = require('./test-helpers')

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
globalThis.bre.getContractFactory = async function(label) {
  return CudosContract.constructLocal(label)
}

// Returns an instance of a contract that is uploaded but not instantiated. A custom signer can be set.
globalThis.bre.getContractFromCodeId = async function(codeId) {
  return CudosContract.constructUploaded(codeId)
}

// Returns an instance of an existing contract by its address. A custom signer can be set.
globalThis.bre.getContractFromAddress = async function(contractAddress) {
  return CudosContract.constructDeployed(contractAddress)
}

// globalThis.bre.assertRevert = assertRevert
module.exports = globalThis.bre
