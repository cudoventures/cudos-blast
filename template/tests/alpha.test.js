describe('alpha contract', () => {
  const MSG_INIT = { count: 13 }
  const MSG_INCREMENT = { increment: {} }
  const MSG_RESET = { reset: { count: 1 } }
  const QUERY_GET_COUNT = { get_count: {} }

  let alice, bob, contract

  beforeAll(async () => {
    jest.setTimeout(20000);
    [alice, bob] = await getSigners()
    contract = await getContractFactory('alpha', bob)
    await contract.deploy(MSG_INIT)
  })

  test('increment count', async () => {
    await contract.execute(MSG_INCREMENT, alice)
    return expect(contract.query(QUERY_GET_COUNT))
      .resolves.toEqual({ count: 14 })
  })

  test('reset count from owner', async () => {
    await contract.execute(MSG_RESET, bob)
    return expect(contract.query(QUERY_GET_COUNT))
      .resolves.toEqual({ count: 1 })
  })

  test('reset count from user throws unauthorized', () => {
    return expect(contract.execute(MSG_RESET, alice))
      .rejects.toThrow('Unauthorized')
  })
})
