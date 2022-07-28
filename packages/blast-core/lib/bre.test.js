// The aim of these tests is to test exposed functions including underlying logic in other modules but only within the
// scope of the source code. Calling any networks or using any files should be mocked

const BlastError = require('../utilities/blast-error')
const { CudosContract } = require('./cudos-contract')

// check formatting
mockedSignersResult = [{
  mockedData: 'mocked signer data', 
  address: 'cudos1yvtuaadhfhxf8ke7zm902z4rj382a8ayymq32s'
}, {
  mockedData: 'mocked signer data', 
  address: 'cudos1xgejtl9heykzscska6cetsferpelygx8g9vxp9'
}]

// utilities/network-utils --> getAccounts() are not covered by any tests as of July 2022
jest.mock('../utilities/network-utils', () => {
  const originalModule = jest.requireActual('../utilities/network-utils')
  return {
    __esModule: true,
    ...originalModule,
    getAccounts: () => [{
      address: "cudos1yvtuaadhfhxf8ke7zm902z4rj382a8ayymq32s",
      mnemonic: "ordinary witness such toddler tag mouse helmet perfect venue eyebrow upgrade rabbit",
    }, {
      address: "cudos1xgejtl9heykzscska6cetsferpelygx8g9vxp9",
      mnemonic: "course hurdle stand heart rescue trap upset cousin dish embody business equip",
    }],
    getCodeDetails: (codeId) => { return {
      id: codeId,
      creator: 'mockedCreatorAddress', //"cudos1yvtuaadhfhxf8ke7zm902z4rj382a8ayymq32s",
      checksum: 'mockedChecksum', //"4ba98b0642afe91d234e32b1f6cb696842977a9cd0a7d8e8e03d5aa85f540dbf",
      data: 'mockedUint8Array'
    }},
    getContractInfo: (contractAddress) => { return {
      address: contractAddress,
      codeId: 13,
      creator: 'mockedCreatorAddress2',
      admin: undefined,
      label: 'mockedLabel',
      ibcPortId: undefined,
    }}
  }
})
// mocking blast.config.js
jest.mock('../utilities/config-utils', () => {
  const originalModule = jest.requireActual('../utilities/config-utils') //requiring actual to create bre object
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
jest.mock('cudosjs', () => {
  const originalModule = jest.requireActual('cudosjs')
  return {
    __esModule: true,
    ...originalModule,
    SigningCosmWasmClient: { connectWithSigner: () => {return { mockedData: 'mocked signer data'}}}
  }
})
jest.mock('../utilities/package-info', () => {
  return {
    __esModule: true,
    getPackageRootPath: () => '/mocked_package_path',
    getProjectRootPath: () => '/mocked_project_path'
  }
})

test('Make sure required objects are the same as global', () => {
  const bre_required = require('./bre')
  expect(bre_required).toEqual(globalThis.bre)
})

jest.setTimeout(100000)
test('Mino test: bre.getSigners()', async () => {
  expect(await bre.getSigners()).toEqual(mockedSignersResult)
})

jest.mock('fs', () => {
  return {
    __esModule: true,
    existsSync: (wasmPath) => {
      return wasmPath === '/mocked_project_path/artifacts/mockedLabel.wasm'
    }
  }
})

test('Mino test: bre.getContractFactory()', async () => {
  const contract = await bre.getContractFactory('mockedLabel')
  expect(contract).toBeInstanceOf(CudosContract)
  expect(contract.getAddress()).toBeUndefined
  expect(contract.getCodeId()).toBeUndefined
  expect(contract.getLabel()).toBeUndefined
  expect(contract.getCreator()).toBeUndefined
})

test('Mino test: bre.getContractFactory() - non-existent/compiled contract', async () => {
  await expect(() => {return bre.getContractFactory('nonExistentLabel')})
    .rejects.toThrow(BlastError)
})

test('Mino test: bre.getContractFromCodeId()', async () => {
  const contract = await bre.getContractFromCodeId(12)
  expect(contract).toBeInstanceOf(CudosContract)
  expect(contract.getAddress()).toBeUndefined
  expect(contract.getCodeId()).toBe(12)
  expect(contract.getLabel()).toBeUndefined
  expect(contract.getCreator()).toBe('mockedCreatorAddress')
})

test('Mino test: bre.getContractFromAddress()', async () => {
  const contract = await bre.getContractFromAddress('someContractAddress')
  expect(contract).toBeInstanceOf(CudosContract)
  expect(contract.getAddress()).toBe('someContractAddress')
  expect(contract.getCodeId()).toBe(13)
  expect(contract.getLabel()).toBe('mockedLabel')
  expect(contract.getCreator()).toBe('mockedCreatorAddress2')
})



//describe('alpha contract', () => {
//  // Optional timeout. Default is 15000
//  jest.setTimeout(30 * 1000);
//
//  const MSG_INIT = { count: 13 }
//  const MSG_INCREMENT = { increment: {} }
//  const MSG_RESET = { reset: { count: 1 } }
//  const QUERY_GET_COUNT = { get_count: {} }
//
//  let alice, bob, contract
//
//  beforeAll(async () => {
//    [alice, bob] = await bre.getSigners()
//    contract = await bre.getContractFactory('alpha')
//    await contract.deploy(MSG_INIT, 'alpha', { signer: bob })
//  })
//
//  test('increment count', async () => {
//    await contract.execute(MSG_INCREMENT, alice)
//    return expect(contract.query(QUERY_GET_COUNT))
//      .resolves.toEqual({ count: 14 })
//  })
//
//  test('reset count from owner', async () => {
//    await contract.execute(MSG_RESET, bob)
//    return expect(contract.query(QUERY_GET_COUNT))
//      .resolves.toEqual({ count: 1 })
//  })
//
//  test('reset count from user throws unauthorized', () => {
//    return expect(contract.execute(MSG_RESET, alice))
//      .rejects.toThrow('Unauthorized')
//  })
//})
