/* eslint-disable no-undef */

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

module.exports = {
  validContractAddress: validContractAddress,
  mockedSigners: mockedSigners,
  mockedUploadTx: mockedUploadTx,
  mockedInstantiateTx: mockedInstantiateTx,
  mockedExecuteTx: mockedExecuteTx,
  mockedQueryTx: mockedQueryTx
}
