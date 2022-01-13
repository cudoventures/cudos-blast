const fsExtra = require('fs-extra')
const process = require('process')
const path = require('path')
const CudosError = require('./cudos-error')

let config = {}

const configPath = path.join(process.cwd(), 'cudos.config.js')

function getConfig() {
  if (fsExtra.pathExistsSync(configPath)) {
    config = require(configPath)
    return config
  }
  throw new CudosError(`Config file was not found! Make sure that cudos.config.js exists at ${configPath}`)
}

function getAccountByName(name) {
  const {
    config
  } = getConfig()

  if (!config.accounts[name]) {
    throw new CudosError('Missing Account in the config file.')
  }
  return config.accounts[name]
}

function getEndpoint() {
  const {
    config
  } = getConfig()

  if (!config.endpoint) {
    throw new CudosError('Missing [endpoint] in the config file.')
  }
  return config.endpoint
}

function getGasPrice() {
  const {
    config
  } = getConfig()

  if (!config.gasPrice) {
    throw new CudosError('Missing gasPrice in the config file.')
  }
  return config.gasPrice
}

module.exports = {
  getAccountByName: getAccountByName,
  getEndpoint: getEndpoint,
  getGasPrice: getGasPrice
}
