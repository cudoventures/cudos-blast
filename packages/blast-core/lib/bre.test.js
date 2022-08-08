// The aim of these tests is to test exposed functions including underlying logic in other modules but only within the
// scope of the source code. Calling any networks or using any files should be mocked

const BlastError = require('../utilities/blast-error')
const { CudosContract } = require('./cudos-contract')

const validSignerAddress = 'cudos1yvtuaadhfhxf8ke7zm902z4rj382a8ayymq32s'
const validContractAddress = 'cudos1x8gwn06l85q0lyncy7zsde8zzdn588k2dck00a8j6lkprydcutwq80rlv2'

// Mocking objects
const mockedSigner1 = {
  mockedData: 'mocked signer data',
  upload: async (signerAddress, wasmFile, uploadFee) => await mockedSignerUpload(signerAddress, wasmFile, uploadFee),
  instantiate: async (signerAddress, codeId, msg, label, instantiateFee, { funds }) =>
    await mockedSignerInstantiate(signerAddress, codeId, msg, label, instantiateFee, { funds: funds }),
  execute: async (signerAddress, contractAddress, msg, fee) =>
    await mockedSignerExecute(signerAddress, contractAddress, msg, fee),
  queryContractSmart: async (contractAddress, msg) => await mockedSignerQueryContractSmart(contractAddress, msg),
  address: validSignerAddress
}

const mockedSigner2 = {
  mockedData: 'mocked signer data',
  upload: async (signerAddress, wasmFile, uploadFee) => await mockedSignerUpload(signerAddress, wasmFile, uploadFee),
  instantiate: async (signerAddress, codeId, msg, label, instantiateFee, { funds }) =>
    await mockedSignerInstantiate(signerAddress, codeId, msg, label, instantiateFee, { funds: funds }),
  execute: async (signerAddress, contractAddress, msg, fee) =>
    await mockedSignerExecute(signerAddress, contractAddress, msg, fee),
  queryContractSmart: async (contractAddress, msg) => await mockedSignerQueryContractSmart(contractAddress, msg),
  address: 'cudos1xgejtl9heykzscska6cetsferpelygx8g9vxp9'
}

const mockedSigners = [mockedSigner1, mockedSigner2]

const mockedSignerUpload = async (signerAddress, wasmFile, uploadFee) => {
  if (signerAddress === validSignerAddress && wasmFile === 'mockedWasmPathBuffer' && uploadFee) {
    return mockedUploadTx
  }
  throw new Error("Mocked error: A parameter in mocked signer's upload() function is not valid")
}
const mockedSignerInstantiate = async (signerAddress, codeId, msg, label, instantiateFee, { funds }) => {
  if (signerAddress === validSignerAddress && typeof codeId === 'number' && codeId && typeof (msg) === 'object' &&
    typeof (label) === 'string' && label && instantiateFee) {
    return mockedInstantiateTx
  }
  throw new Error("Mocked error: A parameter in mocked signer's instantiate() function is not valid")
}
const mockedSignerExecute = async (signerAddress, contractAddress, msg, fee) => {
  if (signerAddress === validSignerAddress && contractAddress === validContractAddress &&
    typeof (msg) === 'object' && fee) {
    return mockedExecuteTx
  }
  throw new Error("Mocked error: A parameter in mocked signer's execute() function is not valid")
}
const mockedSignerQueryContractSmart = async (contractAddress, msg) => {
  if (contractAddress === validContractAddress && typeof (msg) === 'object') {
    return mockedQueryTx
  }
  throw new Error("Mocked error: A parameter in mocked signer's query() function is not valid")
}

const mockedUploadTx = {
  originalSize: 128131,
  originalChecksum: '4ba98b0642afe91d234e32b1f6cb696842977a9cd0a7d8e8e03d5aa85f540dbf',
  compressedSize: 47480,
  compressedChecksum: '87b2d334c13486f88517cf8e0db5aa41b181fe64cdba3ef382a6a1c657a65ceb',
  codeId: 11,
  logs: [],
  height: 16074,
  transactionHash: 'CAB3B37A927C79C181E406926F898CDBFC426CE36918BD6AB6AFA65D4CAEBFFB',
  gasWanted: 1186959,
  gasUsed: 924549
}
const mockedInstantiateTx = {
  contractAddress: validContractAddress,
  logs: [],
  height: 16075,
  transactionHash: 'F3C9182BDFC7063C940E42D190E051836CB85538981B033095E87EF701752AAD',
  gasWanted: 178074,
  gasUsed: 148444
}
const mockedExecuteTx = {
  logs: [],
  height: 3343,
  transactionHash: '4A67215326981758AC278C20E59564BAFB895DD9E72FDCD177FEDE3C5FB44087',
  gasWanted: 178074,
  gasUsed: 131181
}
const mockedQueryTx = { resultData: 'resultData' }

//utilities/network-utils --> getAccounts() are not covered by any tests
// Mocking dependencies
jest.mock('../utilities/network-utils', () => {
  const originalModule = jest.requireActual('../utilities/network-utils')
  return {
    __esModule: true,
    ...originalModule,
    getSigner: (mnemonic) => {
      switch (mnemonic) {
        case 'ordinary witness such toddler tag mouse helmet perfect venue eyebrow upgrade rabbit':
          return mockedSigner1
        case 'course hurdle stand heart rescue trap upset cousin dish embody business equip':
          return mockedSigner2
        default:
          throw new Error('Mocked error: Invalid mnemonic passed to network-utils/getSigner()')
      }
    },
    getDefaultSigner: () => mockedSigners[0],
    getAccounts: () => [{
      address: validSignerAddress,
      mnemonic: 'ordinary witness such toddler tag mouse helmet perfect venue eyebrow upgrade rabbit'
    }, {
      address: 'cudos1xgejtl9heykzscska6cetsferpelygx8g9vxp9',
      mnemonic: 'course hurdle stand heart rescue trap upset cousin dish embody business equip'
    }],
    getCodeDetails: (codeId) => {
      return {
        id: codeId,
        creator: 'mockedCreatorAddress', // validSignerAddress,
        checksum: 'mockedChecksum',
        data: 'mockedUint8Array'
      }
    },
    getContractInfo: (contractAddress) => {
      return {
        address: contractAddress,
        codeId: 13,
        creator: 'mockedCreatorAddress2',
        admin: undefined,
        label: 'mockedLabel',
        ibcPortId: undefined
      }
    }
  }
})
// Mocking blast.config.js
jest.mock('../utilities/config-utils', () => {
  const originalModule = jest.requireActual('../utilities/config-utils') // requiring actual to create bre object
  return {
    __esModule: true,
    ...originalModule,
    getGasPrice: () => '250acudos',
    getAddressPrefix: () => 'cudos',
    getAdditionalAccounts: () => 0,
    getAdditionalAccountsBalances: () => 1000000000000,
    getRustOptimizerVersion: () => '0.12.6',
    getNetwork: (network) => {
      // pass any truthy value to return mocked node url
      return network ? 'https://mocked-sentry-node.cudos.org:36657' : 'http://mocked-localhost:26657'
    }
  }
})
jest.mock('../utilities/package-info', () => {
  return {
    __esModule: true,
    getPackageRootPath: () => '/mocked_package_path',
    getProjectRootPath: () => '/mocked_project_path'
  }
})
jest.mock('fs', () => {
  return {
    __esModule: true,
    existsSync: (wasmPath) => {
      return wasmPath === '/mocked_project_path/artifacts/mockedLabel.wasm'
    },
    readFileSync: (wasmPath) => {
      if (wasmPath === '/mocked_project_path/artifacts/mockedLabel.wasm') {
        return 'mockedWasmPathBuffer'
      }
      throw new Error('Mocked error: Invalid mocked path')
    }
  }
})

// Enable increased timeout when debugging. Default is 5 sec
jest.setTimeout(60 * 1000)

test('Make sure required objects are the same as global', () => {
  const breRequired = require('./bre')
  expect(breRequired).toEqual(globalThis.bre)
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
