// The aim of these tests is to test exposed functions including underlying logic in other modules but only within the
// scope of the source code. Calling any networks or using any files should be mocked

const {
  validContractAddress,
  mockedSigners,
  mockedUploadTx,
  mockedInstantiateTx,
  mockedExecuteTx,
  mockedQueryTx
} = require('./data')

const bre = require('../lib/bre') // the file being tested
const BlastError = require('../utilities/blast-error')
const { CudosContract } = require('../lib/cudos-contract')

// Enable increased timeout when debugging. Default is 5 sec
// jest.setTimeout(60 * 1000)

test('Make sure required objects are the same as global', () => {
  expect(bre).toEqual(globalThis.bre)
})

test('Test bre.getSigners()', async () => {
  // JSON.stringify(...).toMatch(...) is a workaround for comparing objects
  expect(JSON.stringify(await bre.getSigners())).toMatch(JSON.stringify(mockedSigners))
})

test('Test bre.getContractFactory() - Try creating non-existent/non-compiled contract', async () => {
  await expect(bre.getContractFactory('invalidLabel')).rejects.toThrow(BlastError)
})

describe('Test contracts created via bre.getContractFactory()', () => {
  let contract
  // get the contract oblect from local contract
  beforeEach(async () => {
    contract = await bre.getContractFactory('mockedLabel')
  })

  test('Verify bre.getContractFactory()', async () => {
    expect(contract).toBeInstanceOf(CudosContract)
    expect(contract.getAddress()).toBeNull()
    expect(contract.getCodeId()).toBeNull()
    expect(contract.getLabel()).toBeNull()
    expect(contract.getCreator()).toBeNull()
  })

  test('Local contract: instantiate() should fail', async () => {
    await expect(contract.instantiate({}, 'SomeLabel', {})).rejects.toThrow(BlastError)
  })

  test('Local contract: execute() should fail', async () => {
    await expect(contract.execute({}, mockedSigners[0], {})).rejects.toThrow(BlastError)
  })

  test('Local contract: query() should fail', async () => {
    await expect(contract.query({}, mockedSigners[0])).rejects.toThrow(BlastError)
  })

  test('Local contract: uploadCode() with no options parameter', async () => {
    const tx = await contract.uploadCode()
    expect(tx).toMatchObject(mockedUploadTx)
  })

  test('Local contract: uploadCode() with empty options object', async () => {
    const tx = await contract.uploadCode({})
    expect(tx).toMatchObject(mockedUploadTx)
  })

  test('Local contract: uploadCode() with passed valid signer', async () => {
    const tx = await contract.uploadCode({ signer: mockedSigners[0] })
    expect(tx).toMatchObject(mockedUploadTx)
  })

  test('Local contract: uploadCode() with passed another signer', async () => {
    await expect(contract.uploadCode({ signer: mockedSigners[1] })).rejects.toThrow('Mocked error')
  })

  test('Local contract: deploy() with no options parameter', async () => {
    const tx = await contract.deploy({}, 'SomeLabel')
    expect(tx).toMatchObject({
      uploadTx: mockedUploadTx,
      instantiateTx: mockedInstantiateTx
    })
  })

  test('Local contract: deploy() with empty options object', async () => {
    const tx = await contract.deploy({}, 'SomeLabel', {})
    expect(tx).toMatchObject({
      uploadTx: mockedUploadTx,
      instantiateTx: mockedInstantiateTx
    })
  })

  test('Local contract: deploy() with passed valid signer', async () => {
    const tx = await contract.deploy({}, 'SomeLabel', { signer: mockedSigners[0] })
    expect(tx).toMatchObject({
      uploadTx: mockedUploadTx,
      instantiateTx: mockedInstantiateTx
    })
  })

  test('Local contract: deploy() with passed another signer', async () => {
    await expect(contract.deploy({}, 'SomeLabel', { signer: mockedSigners[1] })).rejects.toThrow('Mocked error')
  })

  describe('Test contracts created via bre.getContractFactory(), then uploadCode()', () => {
    beforeEach(async () => {
      await contract.uploadCode({})
    })

    test('Uploaded contract: instantiate()', async () => {
      const tx = await contract.instantiate({}, 'SomeLabel', {})
      expect(tx).toMatchObject(mockedInstantiateTx)
    })

    test('Uploaded contract: uploadCode() should fail', async () => {
      await expect(contract.uploadCode({})).rejects.toThrow(BlastError)
    })

    test('Uploaded contract: deploy() should fail', async () => {
      await expect(contract.deploy({})).rejects.toThrow(BlastError)
    })

    test('Uploaded contract: execute() should fail', async () => {
      await expect(contract.execute({}, mockedSigners[0], {})).rejects.toThrow(BlastError)
    })

    test('Uploaded contract: query() should fail', async () => {
      await expect(contract.query({}, mockedSigners[0])).rejects.toThrow(BlastError)
    })
  })

  describe('Test contracts created via bre.getContractFactory(), then deploy()', () => {
    beforeEach(async () => {
      await contract.deploy({}, 'SomeLabel', {})
    })

    test('Deployed contract: uploadCode() should fail', async () => {
      await expect(contract.uploadCode({})).rejects.toThrow(BlastError)
    })

    test('Deployed contract: deploy() should fail', async () => {
      await expect(contract.deploy({})).rejects.toThrow(BlastError)
    })

    test('Deployed contract: instantiate()', async () => {
      const tx = await contract.instantiate({}, 'SomeLabel', {})
      expect(tx).toMatchObject(mockedInstantiateTx)
    })

    test('Deployed contract: execute()', async () => {
      const tx = await contract.execute({}, mockedSigners[0], {})
      expect(tx).toMatchObject(mockedExecuteTx)
    })

    test('Deployed contract: query()', async () => {
      const tx = await contract.query({}, mockedSigners[0])
      expect(tx).toMatchObject(mockedQueryTx)
    })
  })
})

describe('Test contracts created via bre.getContractFromCodeId()', () => {
  let contract
  // get uploaded, uninstantiated contract oblect
  beforeEach(async () => {
    contract = await bre.getContractFromCodeId(12)
  })

  test('Verify bre.getContractFromCodeId()', async () => {
    expect(contract).toBeInstanceOf(CudosContract)
    expect(contract.getAddress()).toBeNull()
    expect(contract.getCodeId()).toBe(12)
    expect(contract.getLabel()).toBeNull()
    expect(contract.getCreator()).toBe('mockedCreatorAddress')
  })

  test('Uploaded contract: instantiate() with no options parameter', async () => {
    const tx = await contract.instantiate({}, 'SomeLabel')
    expect(tx).toMatchObject(mockedInstantiateTx)
  })

  test('Uploaded contract: instantiate() with empty options object', async () => {
    const tx = await contract.instantiate({}, 'SomeLabel', {})
    expect(tx).toMatchObject(mockedInstantiateTx)
  })

  test('Uploaded contract: instantiate() with passed valid signer', async () => {
    const tx = await contract.instantiate({}, 'SomeLabel', { signer: mockedSigners[0] })
    expect(tx).toMatchObject(mockedInstantiateTx)
  })

  test('Uploaded contract: instantiate() with passed another signer', async () => {
    await expect(contract.instantiate({}, 'SomeLabel', { signer: mockedSigners[1] })).rejects.toThrow('Mocked error')
  })

  test('Uploaded contract: uploadCode() should fail', async () => {
    await expect(contract.uploadCode({})).rejects.toThrow(BlastError)
  })

  test('Uploaded contract: deploy() should fail', async () => {
    await expect(contract.deploy({})).rejects.toThrow(BlastError)
  })

  test('Uploaded contract: execute() should fail', async () => {
    await expect(contract.execute({}, mockedSigners[0], {})).rejects.toThrow(BlastError)
  })

  test('Uploaded contract: query() should fail', async () => {
    await expect(contract.query({}, mockedSigners[0])).rejects.toThrow(BlastError)
  })
})

describe('Test contracts created via bre.getContractFromAddress()', () => {
  let contract
  // get instantiated (deployed) contract oblect
  beforeEach(async () => {
    contract = await bre.getContractFromAddress(validContractAddress)
  })

  test('Verify bre.getContractFromAddress()', async () => {
    expect(contract).toBeInstanceOf(CudosContract)
    expect(contract.getAddress()).toBe(validContractAddress)
    expect(contract.getCodeId()).toBe(13)
    expect(contract.getLabel()).toBe('mockedLabel')
    expect(contract.getCreator()).toBe('mockedCreatorAddress2')
  })

  test('Deployed contract: uploadCode() should fail', async () => {
    await expect(contract.uploadCode({})).rejects.toThrow(BlastError)
  })

  test('Deployed contract: deploy() should fail', async () => {
    await expect(contract.deploy({})).rejects.toThrow(BlastError)
  })

  test('Deployed contract: instantiate()', async () => {
    const tx = await contract.instantiate({}, 'SomeLabel', {})
    expect(tx).toMatchObject(mockedInstantiateTx)
  })

  test('Deployed contract: execute() with no signer and no options parameter', async () => {
    const tx = await contract.execute({})
    expect(tx).toMatchObject(mockedExecuteTx)
  })

  test('Deployed contract: execute() with signer and empty options object', async () => {
    const tx = await contract.execute({}, mockedSigners[0], {})
    expect(tx).toMatchObject(mockedExecuteTx)
  })

  test('Deployed contract: execute() with another signer', async () => {
    await expect(contract.execute({}, mockedSigners[1], {})).rejects.toThrow('Mocked error')
  })

  test('Deployed contract: query()', async () => {
    const tx = await contract.query({})
    expect(tx).toMatchObject(mockedQueryTx)
  })

  test('Deployed contract: query() with passed any signer', async () => {
    const tx = await contract.query({}, mockedSigners[1])
    expect(tx).toMatchObject(mockedQueryTx)
  })
})
