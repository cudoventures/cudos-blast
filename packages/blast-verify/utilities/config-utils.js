const BlastVerifyError = require('./blast-verify-error')
const networks = require('../config/networks-config')
const { getConfig } = require('cudos-blast/utilities/config-utils')

const getVerifyUrlFromNetwork = () => {
  const { config } = getConfig()

  if (!config.verify) {
    throw new BlastVerifyError('Missing [verify] from the config file.')
  }
  if (!config.verify.network) {
    throw new BlastVerifyError('Missing [verify.network] from the config file.')
  }
  if (!networks[config.verify.network]) {
    throw new BlastVerifyError('Invalid network passed in the config file! Use "blast verify --ls" to show ' +
        'all available networks.')
  }
  return networks[config.verify.network]
}

module.exports = { getVerifyUrlFromNetwork: getVerifyUrlFromNetwork }
