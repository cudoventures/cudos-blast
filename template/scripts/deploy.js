const { coin } = require('@cosmjs/stargate');

async function main () {
  const [alice, bob] = await getSigners()
  const fund = [coin(321, "acudos")];

  const contract = await getContractFactory('alpha')
  
  const MSG_INIT = { count: 13 }
  const deploy = await contract.deploy(MSG_INIT, bob, fund)
  const contractAddress = deploy.initTx.contractAddress
  console.log(`Contract deployed at: ${contractAddress}`)
}

module.exports = {
  main: main
};
