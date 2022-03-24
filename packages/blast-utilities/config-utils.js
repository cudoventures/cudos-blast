const fsExtra = require('fs-extra')
const process = require('process')
const path = require('path')
const BlastError = require('./blast-error')
const { localNetwork } = require('../blast-config/blast-constants')

function getConfig() {
  const CONFIG_PATH = path.join(process.cwd(), 'blast.config.js')
  if (!fsExtra.pathExistsSync(CONFIG_PATH)) {
    throw new BlastError(`Config file was not found! Make sure that blast.config.js exists at ${CONFIG_PATH}`)
  }
  const config = require(CONFIG_PATH)
  return config
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
  // network is not passed
  // if default network is set - return it
  if (config.defaultNetwork) {
    if (!config.networks || !config.networks[config.defaultNetwork]) {
      throw new BlastError(`Missing default network: [${config.defaultNetwork}] from the config file.`)
    }
    return config.networks[config.defaultNetwork]
  }
  // if default network is missing - return the local network
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

module.exports = {
  getGasPrice: getGasPrice,
  getAddressPrefix: getAddressPrefix,
  getAdditionalAccounts: getAdditionalAccounts,
  getAdditionalAccountsBalances: getAdditionalAccountsBalances,
  getRustOptimizerVersion: getRustOptimizerVersion,
  getNetwork: getNetwork
}
