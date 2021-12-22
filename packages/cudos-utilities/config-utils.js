const fsExstra = require('fs-extra')
const process = require('process')
const path = require('path')
const VError = require('verror')

let config = {}

const configPath = path.join(process.cwd(), 'cudos.config.js')

async function getConfig() {
  if (await fsExstra.pathExists(configPath)) {
    config = require(configPath)
    return config
  }
  console.log(`Config file was not found! Make sure that cudos.config.js exists at ${configPath}`)
  process.exit(1)
}

async function getAccountByName(name) {
  const {
    config
  } = await getConfig()
  if (!config.accounts[name]) {
    throw new VError('Missing Account in the config file.')
  }

  return config.accounts[name]
}

async function getEndpoint() {
  const {
    config
  } = await getConfig()

  if (!config.endpoint) {
    console.log('Missing [endpoint] in the config file.')
    throw new VError('Missing [endpoint] in the config file.')
  }

  return config.endpoint
}

async function getGasPrice() {
  const {
    config
  } = await getConfig()

  if (!config.gasPrice) {
    throw new VError('Missing gasPrice in the config file.')
  }

  return config.gasPrice
}

module.exports = {
  getAccountByName: getAccountByName,
  getEndpoint: getEndpoint,
  getGasPrice: getGasPrice
}
