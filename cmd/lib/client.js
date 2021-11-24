const {
  SigningCosmWasmClient,
  calculateFee,
  GasPrice
} = require('cudosjs')

const {
  keystore
} = require('./keystore')

const {
  getEndpoint,
  getGasPrice
} = require('./config')

async function faucetSendTo (address, amount) {
  const client = await getClient('faucet')
  const faddr = await keystore.getAccountAddress('faucet')
  const gasPrice = await getGasPrice()
  const fee = calculateFee(80_000, GasPrice.fromString(gasPrice))
  const value = amount.match(/(\d+)/)[0]
  const denom = amount.split(value)[1]
  await client.sendTokens(faddr, address, [{
    amount: value,
    denom: denom
  }], fee)
}

async function getClient (name) {
  const endpoint = await getEndpoint()
  const wallet = await keystore.getSigner(name)
  return await SigningCosmWasmClient.connectWithSigner(endpoint, wallet)
}

module.exports = {
  faucetSendTo: faucetSendTo
}
