async function main() {
  const [alice, bob] = await getSigners()
  const contract = await getContractFromAddress('cudos1uul3yzm2lgskp3dxpj0zg558hppxk6pt8t00qe', bob)

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
