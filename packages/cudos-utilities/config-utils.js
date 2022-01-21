const fsExtra = require('fs-extra')
const process = require('process')
const path = require('path')
const CudosError = require('./cudos-error')

let config = {}

const configPath = path.join(process.cwd(), 'cudos.config.js')

function getConfig() {
  if (!fsExtra.pathExistsSync(configPath)) {
    throw new CudosError(`Config file was not found! Make sure that cudos.config.js exists at ${configPath}`)
  }
  config = require(configPath)
  return config
}

function getAccountByName(name) {
  const { config } = getConfig()

  if (!config.accounts[name]) {
    throw new CudosError('Missing Account in the config file.')
  }
  return config.accounts[name]
}

function getEndpoint() {
  const { config } = getConfig()

  if (!config.endpoint) {
    throw new CudosError('Missing [endpoint] in the config file.')
  }
  return config.endpoint
}

function getGasPrice() {
  const { config } = getConfig()

  if (!config.gasPrice) {
    throw new CudosError('Missing gasPrice in the config file.')
  }
  return config.gasPrice
}

async function getNetwork() {
  const { config } = await getConfig()

  if (!config.network) {
    throw new CudosError('Missing network in the config file.')
  }

  return config.network
}

async function getDefaultAccount() {
  const { config } = await getConfig()

  if (!config.defaultAccount) {
    throw new CudosError('Missing defaultAccount in the config file.')
  }

  return config.defaultAccount
}

module.exports = {
  getAccountByName: getAccountByName,
  getEndpoint: getEndpoint,
  getGasPrice: getGasPrice,
  getNetwork: getNetwork,
  getDefaultAccount: getDefaultAccount
}
