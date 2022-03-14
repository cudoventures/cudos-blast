/* eslint-disable quote-props */
const accounts = require('./accounts.json')
const privateAccounts = require('./private-accounts.json')
module.exports.config = {
  name: 'template',
  network: 'cudos',
  defaultAccount: 'account1',
  accounts: accounts,
  privateAccounts: privateAccounts,
  addressPrefix: 'cudos',
  additionalAccounts: 0,
  customAccountBalances: '1000000000000000000',
  gasPrice: '250acudos',
  rustOptimizerVersion: '0.12.3',
  localNodeUrl: 'http://localhost:26657',
  networks: {
    default: 'http://localhost:26657',
    testnet: 'https://sentry1.gcp-uscentral1.cudos.org:26657'
  }
}
