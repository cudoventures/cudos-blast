const bip39 = require('bip39')
const fs = require('fs')
const { DirectSecp256k1HdWallet } = require('cudosjs')

const { executeNodeMultiCmd } = require('./run-docker-commands')
const defaultAccounts = require('../blast-config/default-accounts.json')
const { transferTokensByNameCommand } = require('./blast-helper')
const { getProjectRootPath } = require('./package-info')
const BlastError = require('./blast-error')
const {
  getAdditionalAccountsBalances,
  getAddressPrefix
} = require('./config-utils')

async function createAdditionalAccounts(numberOfAdditionalAccounts) {
  const accounts = {}
  const customBalance = getAdditionalAccountsBalances()
  const addressPrefix = getAddressPrefix()
  for (let i = 1; i <= numberOfAdditionalAccounts; i++) {
    const mnemonic = bip39.generateMnemonic(256)
    const address = await getAddressFromMnemonic(mnemonic, addressPrefix)
    accounts[`account${10 + i}`] = {
      mnemonic: mnemonic,
      address: address
    }

    executeNodeMultiCmd(
      `echo ${mnemonic} | cudos-noded keys add account${10 + i} --recover --keyring-backend test && ` +
      transferTokensByNameCommand('faucet', `account${10 + i}`, `${customBalance}`)
    )
  }
  const accountsToSave = combineAccountObjects(defaultAccounts, accounts)
  saveAccounts(accountsToSave)
}

async function getAddressFromMnemonic(mnemonic, addressPrefix) {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: addressPrefix })
  const [acc] = await wallet.getAccounts()
  return acc.address
}

function combineAccountObjects(defaultAccounts, newAccounts) {
  const prepareDefaultAccounts = JSON.stringify(defaultAccounts).slice(0, -1) + ','
  const prepareNewAccounts = JSON.stringify(newAccounts).substring(1)
  return prepareDefaultAccounts.concat(prepareNewAccounts)
}

function saveAccounts(accounts) {
  const projectRoot = getProjectRootPath()
  const parsed = JSON.parse(accounts)
  try {
    fs.writeFileSync(`${projectRoot}/accounts.json`, JSON.stringify(parsed, 0, 4))
  } catch (error) {
    throw new BlastError(`Failed to create file at ${projectRoot}/additional-accounts.json with error: ${error}`)
  }
}

module.exports = { createAdditionalAccounts: createAdditionalAccounts }
