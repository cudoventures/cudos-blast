const fsExtra = require('fs-extra')
const process = require('process')
const path = require('path')
const BlastError = require('./blast-error')

let config = {}

const configPath = path.join(process.cwd(), 'blast.config.js')

function getConfig() {
  if (!fsExtra.pathExistsSync(configPath)) {
    throw new BlastError(`Config file was not found! Make sure that blast.config.js exists at ${configPath}`)
  }
  config = require(configPath)
  return config
}

function getAccountByName(name) {
  const { config } = getConfig()

  if (!config.accounts) {
    throw new BlastError('Missing [accounts] in the config file.')
  }

  if (typeof config.accounts[name] !== 'undefined') {
    return config.accounts[name]
  }

  if (typeof config.privateAccounts[name] !== 'undefined') {
    return config.privateAccounts[name]
  }

  throw new BlastError(`Account with name ${name} was not found. Make sure that you have configured "accounts.json" or "private-accounts.json"`)
}

function getEndpoint() {
  const { config } = getConfig()

  if (!config.endpoint) {
    throw new BlastError('Missing [endpoint] in the config file.')
  }
  return config.endpoint
}

function getGasPrice() {
  const { config } = getConfig()

  if (!config.gasPrice) {
    throw new BlastError('Missing gasPrice in the config file.')
  }
  return config.gasPrice
}

async function getNetwork() {
  const { config } = await getConfig()

  if (!config.network) {
    throw new BlastError('Missing network in the config file.')
  }

  return config.network
}

async function getDefaultAccount() {
  const { config } = await getConfig()

  if (!config.defaultAccount) {
    throw new BlastError('Missing defaultAccount in the config file.')
  }

  return config.defaultAccount
}

function getAdditionalAccounts() {
  const { config } = getConfig()

  if (!config.additionalAccounts !== 'undefined') {
    throw new BlastError('Missing [additionalAccounts] in the config file.')
  }
  return config.additionalAccounts
}

function getAdditionalAccountsBalances() {
  const { config } = getConfig()

  if (!config.customAccountBalances) {
    throw new BlastError('Missing [customAccountBalances] in the config file.')
  }
  return config.customAccountBalances
}

module.exports = {
  getAccountByName: getAccountByName,
  getEndpoint: getEndpoint,
  getGasPrice: getGasPrice,
  getNetwork: getNetwork,
  getDefaultAccount: getDefaultAccount,
  getAdditionalAccounts: getAdditionalAccounts,
  getAdditionalAccountsBalances: getAdditionalAccountsBalances
}
