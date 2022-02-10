async function main () {
  const contract = await getContractFactory('alpha', {
    count: 13
  })
  const contractAddress = await contract.deploy()
  console.log(`Contract is deployed at: ${contractAddress}`)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(`${error}`)
    process.exit(1)
  })
