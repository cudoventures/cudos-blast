const expect = require('chai').expect

describe('alpha test', function () {
  it('should get count', async function () {
    await setClient(null, null)

    const alphaContract = await getContractFactory('alpha', {
      count: 13
    })
  
    await alphaContract.deploy()

    const count = await alphaContract.querySmart({
      get_count: {}
    })

    expect(count).eql({ count: 13 })
  })
})
