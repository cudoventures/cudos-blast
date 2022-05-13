async function main () {
  const [alice, bob] = await bre.getSigners()
  const contract = await bre.getContractFactory('alpha')
  
  const MSG_INIT = { count: 13 }
  const deploy = await contract.deploy(MSG_INIT, bob)
  const contractAddress = deploy.initTx.contractAddress
  console.log(`Contract deployed at: ${contractAddress}`)
}

module.exports = {
  main: main
};
