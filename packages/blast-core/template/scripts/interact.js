// You can require Blast Runtime Environment explicitly to enable your code editor's IntelliSense
// const bre = require('cudos-blast')

async function main() {
  const [alice, bob] = await bre.getSigners()
  const contract = await bre.getContractFromAddress('cudos1uul3yzm2lgskp3dxpj0zg558hppxk6pt8t00qe')

  const QUERY_GET_COUNT = { get_count: {} }
  let count = await contract.query(QUERY_GET_COUNT, alice)
  console.log('Initial count: ' + count.count)

  const MSG_INCREMENT = { increment: {} }
  const result = await contract.execute(MSG_INCREMENT, bob)
  console.log(result)

  count = await contract.query(QUERY_GET_COUNT)
  console.log('Count after increment: ' + count.count)
}

module.exports = { main: main }
