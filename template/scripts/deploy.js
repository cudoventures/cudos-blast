async function main () {
  const [alice, bob] = await getSigners()
  const contract = await getContractFactory('alpha')
  
  const MSG_INIT = { count: 13 }
  const contractAddress = await contract.deploy(MSG_INIT, bob)
  console.log(`${contractAddress}`)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(`${error}`)
    process.exit(1)
  })
