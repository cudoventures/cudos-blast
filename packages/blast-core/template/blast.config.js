/* eslint-disable object-curly-newline */
module.exports.config = {
  addressPrefix: 'cudos',
  rustOptimizerVersion: '0.12.6',
  gasPrice: '250acudos',

  // optional parameners
  gasLimit: 'auto',
  gasMultiplier: 'auto',
  additionalAccounts: 0,
  customAccountBalances: 1000000000000000000,
  networks: {
    testnet: 'https://sentry1.gcp-uscentral1.cudos.org:36657'
  }
}
