async function main() {
  const [alice, bob] = await getSigners()
  const contract = await getContractFactory('alpha')
  
  const MSG_INIT = { count: 13 }
  await contract.deploy(MSG_INIT, bob)

  const QUERY_GET_COUNT = { get_count: {} }
  let count = await contract.query(QUERY_GET_COUNT)
  console.log('Initial count: ' + count.count)

  const MSG_INCREMENT = { increment: {} }
  const result = await contract.execute(MSG_INCREMENT, bob)
  console.log(result)

  count = await contract.query(QUERY_GET_COUNT, alice)
  console.log('Count after increment: ' + count.count)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(`${error}`)
    process.exit(1)
  })
