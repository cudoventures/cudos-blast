const fs = require('fs')
const path = require('path')
const bip39 = require('bip39')
const { DirectSecp256k1HdWallet } = require('cudosjs')

const { getProjectRootPath } = require('./package-info')
const BlastError = require('./blast-error')

let localAccounts

function getLocalAccounts() {
  if (!localAccounts) {
    const configPath = path.join(getProjectRootPath(), 'local-accounts.json')
    localAccounts = Object.values(require(configPath))
  }
  return localAccounts
}

function getPrivateAccounts() {
  const configPath = path.join(getProjectRootPath(), 'private-accounts.json')
  const privateAccounts = require(configPath)
  delete privateAccounts.comment
  return Object.values(privateAccounts)
}

async function generateRandomAccount(addressPrefix) {
  const mnemonic = bip39.generateMnemonic(256)
  const address = await getAddressFromMnemonic(mnemonic, addressPrefix)
  return {
    address: address,
    mnemonic: mnemonic
  }
}

async function getAddressFromMnemonic(mnemonic, addressPrefix) {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: addressPrefix })
  const [acc] = await wallet.getAccounts()
  return acc.address
}

function createLocalAccountsFile(accounts) {
  const accountFilePath = path.join(getProjectRootPath(), 'local-accounts.json')
  // delete accounts file if exists
  fs.rmSync(accountFilePath, { force: true })
  try {
    // create accounts file as read-only
    fs.writeFileSync(accountFilePath, JSON.stringify(accounts, 0, 4), { mode: 0o444 })
  } catch (error) {
    throw new BlastError(`Failed to create file at ${accountFilePath} with error: ${error}`)
  }
}

module.exports = {
  getLocalAccounts: getLocalAccounts,
  getPrivateAccounts: getPrivateAccounts,
  generateRandomAccount: generateRandomAccount,
  createLocalAccountsFile: createLocalAccountsFile
}
