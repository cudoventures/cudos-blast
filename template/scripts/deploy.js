async function main () {
  const [alice, bob] = await getSigners()
  const contract = await getContractFactory('alpha')
  
  const MSG_INIT = { count: 13 }
  const deploy = await contract.deploy(MSG_INIT, bob, funds)
  const contractAddress = deploy.initTx.contractAddress
  console.log(`${contractAddress}`)
}

module.exports = {
  main: main
};
