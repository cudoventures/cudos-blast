async function main () {
  const [alice, bob] = await getSigners()

  const contract = await getContractFactory('alpha', bob)
  
  const MSG_INIT = { count: 13 }
  const deploy = await contract.deploy(MSG_INIT)
  const contractAddress = deploy.initTx.contractAddress
  console.log(`Contract deployed at: ${contractAddress}`)
}

module.exports = {
  main: main
};
