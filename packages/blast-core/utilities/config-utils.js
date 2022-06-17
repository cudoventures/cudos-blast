const fs = require('fs')
const path = require('path')
const BlastError = require('./blast-error')
const {
  DEFAULT_DENOM,
  GAS_AUTO,
  LOCAL_NETWORK
} = require('../config/blast-constants')
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
  return LOCAL_NETWORK
}

function getGasPrice() {
  const { config } = getConfig()

  if (!config.gasPrice) {
    throw new BlastError('Missing [gasPrice] from the config file.')
  }
  return config.gasPrice + DEFAULT_DENOM
}

function getGasLimit() {
  const { config } = getConfig()

  if (!config.gasLimit) {
    return GAS_AUTO
  }
  return config.gasLimit
}

function getGasMultiplier() {
  const { config } = getConfig()

  if (!config.gasMultiplier) {
    return GAS_AUTO
  }
  return config.gasMultiplier
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

module.exports = {
  getGasPrice: getGasPrice,
  getGasLimit: getGasLimit,
  getGasMultiplier: getGasMultiplier,
  getAddressPrefix: getAddressPrefix,
  getAdditionalAccounts: getAdditionalAccounts,
  getAdditionalAccountsBalances: getAdditionalAccountsBalances,
  getRustOptimizerVersion: getRustOptimizerVersion,
  getNetwork: getNetwork
}
