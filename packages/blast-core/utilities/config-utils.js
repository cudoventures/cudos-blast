const fs = require('fs')
const path = require('path')
const BlastError = require('./blast-error')
const { localNetwork } = require('../config/blast-constants')
const { getProjectRootPath } = require('./package-info')

// creating global Blast runtime environment to hold exposed core fuctions and possible plugins
globalThis.bre = {}

// Blast config utils

function getConfig() {
  const CONFIG_PATH = path.join(getProjectRootPath(), 'blast.config.js')
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new BlastError(`Config file was not found! Make sure that blast.config.js exists at ${CONFIG_PATH}`)
  }
  return require(CONFIG_PATH)
}

function getNetwork(network) {
  const { config } = getConfig()

  if (network) {
  // network is passed - return it
    if (!config.networks || !config.networks[network]) {
      throw new BlastError(`Missing network: [${network}] from the config file.`)
    }
    return config.networks[network]
  }
  // network is not passed - return the local network
  return localNetwork
}

function getGasPrice() {
  const { config } = getConfig()

  if (!config.gasPrice) {
    throw new BlastError('Missing [gasPrice] from the config file.')
  }
  return config.gasPrice
}

function getAddressPrefix() {
  const { config } = getConfig()

  if (!config.addressPrefix) {
    throw new BlastError('Missing [addressPrefix] from the config file.')
  }
  return config.addressPrefix
}

function getAdditionalAccounts() {
  const { config } = getConfig()
  return config.additionalAccounts
}

function getAdditionalAccountsBalances() {
  const { config } = getConfig()

  if (!config.customAccountBalances) {
    throw new BlastError('Missing [customAccountBalances] from the config file.')
  }
  return config.customAccountBalances
}

function getRustOptimizerVersion() {
  const { config } = getConfig()

  if (!config.rustOptimizerVersion) {
    throw new BlastError('Missing [rustOptimizerVersion] from the config file.')
  }
  return config.rustOptimizerVersion
}

// Accounts config utils

function getAccounts() {
  const configPath = path.join(getProjectRootPath(), 'accounts.json')
  return Object.values(require(configPath))
}

// Private accounts config utils

function getPrivateAccounts() {
  const configPath = path.join(getProjectRootPath(), 'private-accounts.json')
  const privateAccounts = require(configPath)
  delete privateAccounts.comment
  return privateAccounts
}

module.exports = {
  getGasPrice: getGasPrice,
  getAddressPrefix: getAddressPrefix,
  getAdditionalAccounts: getAdditionalAccounts,
  getAdditionalAccountsBalances: getAdditionalAccountsBalances,
  getRustOptimizerVersion: getRustOptimizerVersion,
  getNetwork: getNetwork,
  getAccounts: getAccounts,
  getPrivateAccounts: getPrivateAccounts,
  getConfig: getConfig
}
