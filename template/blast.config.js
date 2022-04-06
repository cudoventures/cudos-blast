/* eslint-disable object-curly-newline */
module.exports.config = {
  addressPrefix: 'cudos',
  gasPrice: '250acudos',
  rustOptimizerVersion: '0.12.3',

  // optional parameners
  additionalAccounts: 0,
  customAccountBalances: 1000000000000000000,
  defaultNetwork: '',
  networks: {
    testnet: 'https://sentry1.gcp-uscentral1.cudos.org:36657'
  }
}
