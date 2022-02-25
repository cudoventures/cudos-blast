const fsExtra = require('fs-extra')
const process = require('process')
const path = require('path')
const BlastError = require('./blast-error')

function getConfig() {
  const CONFIG_PATH = path.join(process.cwd(), 'blast.config.js')
  if (!fsExtra.pathExistsSync(CONFIG_PATH)) {
    throw new BlastError(`Config file was not found! Make sure that blast.config.js exists at ${CONFIG_PATH}`)
  }
  const config = require(CONFIG_PATH)
  return config
}

function getNetworkUrl() {
  const { config } = getConfig()

  if (!config.networkUrl) {
    throw new BlastError('Missing networkUrl in the config file.')
  }
  return config.networkUrl
}

function getGasPrice() {
  const { config } = getConfig()

  if (!config.gasPrice) {
    throw new BlastError('Missing gasPrice in the config file.')
  }
  return config.gasPrice
}

function getAddressPrefix() {
  const { config } = getConfig()

  if (!config.addressPrefix) {
    throw new BlastError('Missing network in the config file.')
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
    throw new BlastError('Missing [customAccountBalances] in the config file.')
  }
  return config.customAccountBalances
}

function getRustOptimizerVersion() {
  const { config } = getConfig()

  if (!config.rustOptimizerVersion) {
    throw new BlastError('Missing rustOptimizerVersion in the config file.')
  }
  return config.rustOptimizerVersion
}

module.exports = {
  getNetworkUrl: getNetworkUrl,
  getGasPrice: getGasPrice,
  getAddressPrefix: getAddressPrefix,
  getAdditionalAccounts: getAdditionalAccounts,
  getAdditionalAccountsBalances: getAdditionalAccountsBalances,
  getRustOptimizerVersion: getRustOptimizerVersion
}
