const fs = require('fs')
const path = require('path')
const bip39 = require('bip39')
const { DirectSecp256k1HdWallet } = require('cudosjs')

const { executeNodeMultiCmd } = require('./run-docker-commands')
const { transferTokensByNameCommand } = require('./blast-helper')
const { getProjectRootPath } = require('./package-info')
const BlastError = require('./blast-error')
const {
  getAdditionalAccounts,
  getAdditionalAccountsBalances,
  getAddressPrefix
} = require('./config-utils')

async function createLocalAccountsFile() {
  let localAccounts = require('../blast-config/default-accounts.json')
  const numberOfAdditionalAccounts = getAdditionalAccounts()
  if (numberOfAdditionalAccounts > 0) {
    const additionalAccounts = {}
    const customBalance = getAdditionalAccountsBalances()
    const addressPrefix = getAddressPrefix()
    for (let i = 1; i <= numberOfAdditionalAccounts; i++) {
      const mnemonic = bip39.generateMnemonic(256)
      const address = await getAddressFromMnemonic(mnemonic, addressPrefix)
      // save the generated additional account so all accounts can be saved to a file later
      additionalAccounts[`account${10 + i}`] = {
        mnemonic: mnemonic,
        address: address
      }
      // add new account from mnemonic to the local node and fund it
      executeNodeMultiCmd(
        `echo ${mnemonic} | cudos-noded keys add account${10 + i} --recover --keyring-backend test && ` +
        transferTokensByNameCommand('faucet', `account${10 + i}`, `${customBalance}`)
      )
    }
    localAccounts = {
      ...localAccounts,
      ...additionalAccounts
    }
  }
  saveAccounts(localAccounts)
}

function getAccounts() {
  const configPath = path.join(getProjectRootPath(), 'accounts.json')
  return Object.values(require(configPath))
}

function getPrivateAccounts() {
  const configPath = path.join(getProjectRootPath(), 'private-accounts.json')
  const privateAccounts = require(configPath)
  delete privateAccounts.comment
  return privateAccounts
}

async function getAddressFromMnemonic(mnemonic, addressPrefix) {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: addressPrefix })
  const [acc] = await wallet.getAccounts()
  return acc.address
}

function saveAccounts(accounts) {
  const accountFilePath = path.join(getProjectRootPath(), 'accounts.json')
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
  createLocalAccountsFile: createLocalAccountsFile,
  getAccounts: getAccounts,
  getPrivateAccounts: getPrivateAccounts
}
