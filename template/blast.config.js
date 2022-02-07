/* eslint-disable quote-props */
const accounts = require('./accounts.json')
const privateAccounts = require('./private-accounts.json')
module.exports.config = {
  name: 'template',
  network: 'cudos',
  defaultAccount: 'account1',
  accounts: accounts,
  privateAccounts: privateAccounts,
  additionalAccounts: 0,
  customAccountBalances: '1000000000000000000',
  gasPrice: '250acudos',
  endpoint: 'http://localhost:26657'
}
