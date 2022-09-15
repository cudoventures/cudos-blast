require('cudos-blast/utilities/task') // The test runner needs "task" as a global function
const data = require('./data')

const verify = require('../verify') // The file being tested
const BlastVerifyError = require('../utilities/blast-verify-error')

// Mock setTimeout to run immediately
globalThis.setTimeout = (callback) => {
  callback()
}

beforeEach(() => {
  data.resetFlags()
})
afterEach(() => {
  expect(data.flags.isContractsZipExisting).toBeFalsy()
})

test('Test verifyContract()', async () => {
  expect(JSON.stringify(await verify.verifyContract('validLabel', data.validContractAddress)))
    .toMatch(JSON.stringify(data.mockedResult))
  expect(data.flags.isContractsZipExisting).toBeFalsy()
})

describe('Test verifyContract() with incorrect input', () => {
  test('Test verifyContract() with missing label', async () => {
    await expect(verify.verifyContract('', data.validContractAddress)).rejects.toThrow(BlastVerifyError)
  })

  test('Test verifyContract() with missing address', async () => {
    await expect(verify.verifyContract('validLabel')).rejects.toThrow(BlastVerifyError)
  })

  test('Test verifyContract() with invalid address', async () => {
    await expect(verify.verifyContract('validLabel', data.invalidContractAddress)).rejects.toThrow(BlastVerifyError)
  })
})

describe('Test with problems outside of cudos-blast package ', () => {
  test('Test verifyContract() with invalid network in config', async () => {
    data.flags.isConfigCorrect = false
    await expect(verify.verifyContract('validLabel', data.validContractAddress)).rejects.toThrow(BlastVerifyError)
  })

  test('Test verifyContract() with faulty verification API', async () => {
    data.flags.isApiImpeccable = false
    await expect(verify.verifyContract('validLabel', data.validContractAddress)).rejects.toThrow(Error)
    expect(data.flags.isContractsZipExisting).toBeFalsy()
  })
})
