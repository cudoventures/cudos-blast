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

  if (!config.accounts[name]) {
    throw new BlastError('Missing Account in the config file.')
  }
  return config.accounts[name]
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

module.exports = {
  getAccountByName: getAccountByName,
  getEndpoint: getEndpoint,
  getGasPrice: getGasPrice
}