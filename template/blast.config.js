module.exports.config = {
  addressPrefix: 'cudos',
  customAccountBalances: '1000000000000000000',
  gasPrice: '250acudos',
  rustOptimizerVersion: '0.12.3',
  localNetwork: 'http://localhost:26657',

  additionalAccounts: 0,
  defaultNetwork: '',
  networks: {
    local: 'http://localhost:26657',
    testnet: 'https://sentry1.gcp-uscentral1.cudos.org:26657'
  }
}
