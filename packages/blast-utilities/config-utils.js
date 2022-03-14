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

function getNodeUrl(network) {
  const { config } = getConfig()

  // network parameter is not passed when we need the local node URL
  if (typeof network === 'undefined') {
    if (!config.localNodeUrl) {
      throw new BlastError('Missing localNodeUrl in the config file.')
    }
    return config.localNodeUrl
  }
  // check for custom network name
  if (!config.networks || !config.networks[network]) {
    throw new BlastError(`Missing network: ${network} in the config file.`)
  }
  return config.networks[network]
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
  getNodeUrl: getNodeUrl,
  getGasPrice: getGasPrice,
  getAddressPrefix: getAddressPrefix,
  getAdditionalAccounts: getAdditionalAccounts,
  getAdditionalAccountsBalances: getAdditionalAccountsBalances,
  getRustOptimizerVersion: getRustOptimizerVersion
}
