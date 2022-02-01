const fsExtra = require('fs-extra')
const process = require('process')
const path = require('path')
const BlastError = require('./blast-error')
const defaultAccounts = require('../blast-config/default-accounts.json')

let config = {}

const configPath = path.join(process.cwd(), 'blast.config.js')
const customAccountsPath = path.join(process.cwd(), 'cusotm-accounts.json')

function getConfig() {
  if (!fsExtra.pathExistsSync(configPath)) {
    throw new BlastError(`Config file was not found! Make sure that blast.config.js exists at ${configPath}`)
  }
  config = require(configPath)
  return config
}

function getCustomAccountByName(name) {
  if (!fsExtra.pathExistsSync(customAccountsPath)) {
    throw new BlastError(`Custom accounts file was not found! Make sure that cusotm-accounts.json was generated at ${configPath}`)
  }
  const customAccounts = require(customAccountsPath)
  return customAccounts[name]
}

function getAccountByName(name) {
  if (typeof defaultAccounts[name] !== 'undefined') {
    return defaultAccounts[name]
  }
  if (typeof getCustomAccountByName(name) !== 'undefined') {
    return getCustomAccountByName(name)
  }
  // TODO: handle user account
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

  if (config.additionalCustomAccounts) {
    return config.additionalCustomAccounts
  }
  return false
}

module.exports = {
  getAccountByName: getAccountByName,
  getEndpoint: getEndpoint,
  getGasPrice: getGasPrice,
  getNetwork: getNetwork,
  getDefaultAccount: getDefaultAccount,
  getAdditionalAccounts: getAdditionalAccounts
}
