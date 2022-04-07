async function main () {
  const [alice, bob] = await getSigners()
  const contract = await getContractFactory('alpha', bob)
  
  const MSG_INIT = { count: 13 }
  // deploying as bob
  const deploy = await contract.deploy(MSG_INIT)
  const contractAddress = deploy.initTx.contractAddress
  console.log(`Contract deployed at: ${contractAddress}`)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(`${error}`)
    process.exit(1)
  })
