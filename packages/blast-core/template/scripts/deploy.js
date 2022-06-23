const bre = require('cudos-blast')

async function main() {
  const [alice] = await bre.getSigners()
  const contract = await bre.getContractFactory('alpha')

  const MSG_INIT = { count: 13 }
  await contract.deploy(MSG_INIT, 'alpha', {
    signer: alice,
    funds: {
      amount: 123, token: 'acudos'
    }
  })
  console.log(`Contract deployed at: ${contract.getAddress()}`)
}

module.exports = { main: main }
