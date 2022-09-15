/* eslint-disable no-undef */

const validContractAddress = 'cudos1x8gwn06l85q0lyncy7zsde8zzdn588k2dck00a8j6lkprydcutwq80rlv2'
const invalidContractAddress = 'cudos1x8gwn06l85q0lyncy7zsde8zzdn588k2dck00a8j6lkprydcutwq80rlv3'
const testedVErifyApiUrl = 'http://34.172.163.122:3333'

const mockFlags = {
  isContractsZipExisting: false,
  isTempFolderExisting: false,
  isConfigCorrect: true,
  isApiImpeccable: true
}

const resetFlags = () => {
  mockFlags.isContractsZipExisting = false
  mockFlags.isTempFolderExisting = false
  mockFlags.isConfigCorrect = true
  mockFlags.isApiImpeccable = true
}

// mocked objects
const mockedConfig = { config: {
  addressPrefix: 'cudos',
  gasPrice: '250acudos',
  rustOptimizerVersion: '0.12.6',
  additionalAccounts: 0,
  customAccountBalances: 1000000000000000000,
  networks: {
    testnet: 'https://sentry1.gcp-uscentral1.cudos.org:36657',
    private_testnet: 'http://34.123.153.6:26657'
  },
  verify: { network: 'private_testnet' }
} }

const mockedIncorrectConfig = { config: {
  addressPrefix: 'cudos',
  gasPrice: '250acudos',
  rustOptimizerVersion: '0.12.6',
  additionalAccounts: 0,
  customAccountBalances: 1000000000000000000,
  networks: {
    testnet: 'https://sentry1.gcp-uscentral1.cudos.org:36657',
    private_testnet: 'http://34.123.153.6:26657'
  },
  verify: { network: 'invalid_network' }
} }

let resolvePromise = () => {
  throw new Error('Mocked error: Unresolved promise during mocked archiving.')
}

const mockedValidStream = { on: (event, listener) => {
  if (event === 'close') {
    resolvePromise = listener
  }
} }

const mockedArchiveObject = {
  isPipedToStream: false,
  directory: () => mockedArchiveObject,
  file: () => mockedArchiveObject,
  on: () => mockedArchiveObject,
  pipe: (stream) => {
    if (stream === mockedValidStream) {
      isPipedToStream = true
    }
    return mockedArchiveObject
  },
  finalize: async () => {
    if (isPipedToStream && mockFlags.isTempFolderExisting) {
      mockFlags.isContractsZipExisting = true
      resolvePromise()
    }
  }
}

const mockedVerificationResponse = {
  status: 201,
  data: { id: 12 }
}

const mockedResult = {
  parsed: true,
  verified: true
}

const mockedVerifyResult = { data: mockedResult }

// Mocking blast.config.js
jest.mock('cudos-blast/utilities/config-utils', () => {
  // requiring actual to create bre object
  const originalModule = jest.requireActual('cudos-blast/utilities/config-utils')
  return {
    __esModule: true,
    ...originalModule,
    getConfig: () => mockFlags.isConfigCorrect ? mockedConfig : mockedIncorrectConfig,
    getRustOptimizerVersion: () => '0.12.6'
  }
})

jest.mock('cudos-blast/utilities/package-info', () => {
  return {
    __esModule: true,
    getPackageRootPath: () => '/mocked_package_path',
    getProjectRootPath: () => '/mocked_project_path'
  }
})

jest.mock('fs', () => {
  return {
    __esModule: true,
    existsSync: (path) => {
      return (path === '/mocked_project_path/contracts/validLabel' ||
        path === '/mocked_project_path/contracts' ||
        path === '/mocked_project_path/Cargo.lock' ||
        path === '/mocked_project_path/Cargo.toml' ||
        (path === '/mocked_project_path/temp' ? mockFlags.isTempFolderExisting : false) ||
        path === '/mocked_project_path/blast.config.js')
    },
    mkdirSync: (path) => {
      if (path === '/mocked_project_path/temp') {
        mockFlags.isTempFolderExisting = true
      }
    },
    createWriteStream: (path) => {
      if (path === '/mocked_project_path/temp/blast-contracts.zip') {
        return mockedValidStream
      }
      return null
    },
    createReadStream: (path) => {
      if (path !== '/mocked_project_path/temp/blast-contracts.zip') {
        throw new Error('Mocked error: Invalid path passed on creating read stream.')
      }
      return 'validReadStream'
    },
    rmSync: (path) => {
      if (path === '/mocked_project_path/temp') {
        mockFlags.isTempFolderExisting = false
        mockFlags.isContractsZipExisting = false
      }
    }
  }
})

jest.mock('archiver', () => {
  return () => mockedArchiveObject
})

jest.mock('axios', () => {
  return {
    __esModule: true,
    post: async (url) => {
      if (!mockFlags.isApiImpeccable) {
        throw new Error('Mocked error: Simulated verify API error.')
      }
      if (url !== `${testedVErifyApiUrl}/verify-contract`) {
        throw new Error('Mocked error: Invalid verify API url passed on POST.')
      }
      if (!mockFlags.isContractsZipExisting) {
        throw new Error('Mocked error: Contracts archive file is not created.')
      }
      return mockedVerificationResponse
    },
    get: async (url) => {
      if (url !== `${testedVErifyApiUrl}/verification-status?id=12`) {
        throw new Error('Mocked error: Invalid verify API url passed on GET.')
      }
      return mockedVerifyResult
    }
  }
})

module.exports = {
  validContractAddress: validContractAddress,
  invalidContractAddress: invalidContractAddress,
  flags: mockFlags,
  resetFlags: resetFlags,
  mockedResult: mockedResult
}
