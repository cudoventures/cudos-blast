const fs = require('fs')
const axios = require('axios')
const FormData = require('form-data')
const path = require('path')
const archiver = require('archiver')

const networks = require('./config/networks-config')
const {
  CONTRACTS_ARCHIVE_FILENAME,
  ARCHIVE_EXTENTION
} = require('./config/verify-constants')
const { isValidAddress } = require('./utilities/address-utils')
const BlastVerifyError = require('./utilities/blast-verify-error')
const { getVerifyUrlFromNetwork } = require('./utilities/config-utils')
const { getRustOptimizerVersion } = require('cudos-blast/utilities/config-utils')
const { getProjectRootPath } = require('cudos-blast/utilities/package-info')

globalThis.verify = globalThis.bre.verify = {}

globalThis.bre.verify.verifyContract = async (localContractLabel, contractAddress) => {
  const apiUrl = getVerifyUrlFromNetwork()

  // parameters validation
  if (!localContractLabel) {
    throw new BlastVerifyError('Missing required parameter: contract label')
  }
  if (!fs.existsSync(path.join(getProjectRootPath(), 'contracts', localContractLabel))) {
    throw new BlastVerifyError(`"${localContractLabel}" contract folder not found! ` +
      'Make sure your contract is in /contracts folder.')
  }
  if (!contractAddress) {
    throw new BlastVerifyError('Missing required parameter: contract address')
  }
  // TODO: This function is a workaround. isValidAddress() from cudosjs should be used once the bug about the address
  // byte length encoding is fixed.
  if (!isValidAddress(contractAddress, 'cudos')) {
    throw new BlastVerifyError('Provided contract address is not a valid address!')
  }

  const tempDir = path.join(getProjectRootPath(), 'temp')
  const outputArchiveDir = path.join(tempDir, `${CONTRACTS_ARCHIVE_FILENAME}.${ARCHIVE_EXTENTION}`)
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir)
  }
  let verificationResponse
  try {
    console.log('Creating a local contracts archive...')
    await createContractsArchive(outputArchiveDir)

    // Submit a job to verify the contract
    const form = new FormData()
    form.append('address', contractAddress)
    form.append('crateName', localContractLabel)
    form.append('optimizer', `cosmwasm/workspace-optimizer:${getRustOptimizerVersion()}`)
    form.append('source', fs.createReadStream(outputArchiveDir))
    console.log('Uploading contracts for verification...')
    verificationResponse = await axios.post(`${apiUrl}/verify-contract`, form, { headers: { ...form.getHeaders() } })
  // eslint-disable-next-line no-useless-catch
  } catch (err) {
    throw err
  } finally {
    // Always delete the archive
    fs.rmSync(tempDir, {
      recursive: true, force: true
    })
  }
  if (verificationResponse.status !== 201) {
    throw new BlastVerifyError(`Verify contract API request failed! Response status: ${verificationResponse.status}`)
  }

  const id = verificationResponse.data.id
  console.log('Verification job is submitted. Getting the result may take a long time. Now you can opt to safely free' +
    ' your terminal by killing the process (ctrl+C) and check the status manually on ' +
    `${apiUrl}/verification-status?id=${id}`)

  // Periodically check if the verification job is done
  console.log('Verifying contract...')
  let isVerified = false
  let data
  do {
    // Pause the process for 5 seconds
    await new Promise((resolve) => {
      setTimeout(resolve, 5 * 1000)
    })
    data = (await axios.get(`${apiUrl}/verification-status?id=${id}`)).data

    // checks for error messages from API
    if (data.verificationError && data.verificationError.length > 0) {
      console.log(`Verification failed! Reason: ${data.verificationError}`)
      return data
    }
    if (data.parsingError && data.parsingError.length > 0) {
      console.log(`Parsing failed! Reason: ${data.parsingError}`)
      return data
    }
    // watch for the progress depending on API response
    if (!isVerified && data.verified) {
      isVerified = true
      console.log('Smart contract is verified successfully! Parsing schema...')
    }
  } while (!data.parsed)
  console.log('Schema is parsed successfully!')
  return data
}

const createContractsArchive = (outputArchiveDir) => {
  const contractsDir = path.join(getProjectRootPath(), 'contracts')
  const packagesDir = path.join(getProjectRootPath(), 'packages')
  const cargoLockDir = path.join(getProjectRootPath(), 'Cargo.lock')
  const cargoTomlDir = path.join(getProjectRootPath(), 'Cargo.toml')

  if (!fs.existsSync(contractsDir)) {
    throw new BlastVerifyError('No contracts folder found! Make sure to place your smart contracts in /contracts.')
  }
  if (!fs.existsSync(cargoLockDir)) {
    throw new BlastVerifyError('No Cargo.lock file found in the project root directory!')
  }
  if (!fs.existsSync(cargoTomlDir)) {
    throw new BlastVerifyError('No Cargo.toml file found in the project root directory!')
  }

  const archive = archiver(ARCHIVE_EXTENTION, { zlib: { level: 9 } }) // Sets the compression level.
  const outputStream = fs.createWriteStream(outputArchiveDir)

  return new Promise((resolve, reject) => {
    archive
      .directory(contractsDir, 'contracts')
      .directory(packagesDir, 'packages')
      .file(cargoLockDir, { name: 'Cargo.lock' })
      .file(cargoTomlDir, { name: 'Cargo.toml' })
      .on('error', (err) => {
        console.log('Archiver error:')
        reject(err)
      })
      .on('warning', (err) => {
        if (err.code === 'ENOENT') {
          console.log(`Archiver warning: ${err}`)
        } else {
          console.log('Archiver error:')
          reject(err)
        }
      })
      .pipe(outputStream)
    outputStream.on('close', () => { resolve() })
    outputStream.on('end', () => { reject(new BlastVerifyError('Archiver error: Data has been drained')) })
    archive.finalize()
  })
}

globalThis.task('verify', "Verify a deployed smart contract's code matches a local one")
  .addParam('address', "Deployed contract's address", 'a', 'string', false)
  .addParam('label', "Local smart contract's label", 'l', 'string', false)
  .addParam('list-networks', 'Prints all supported networks', 'ls', 'boolean', false, false)
  .setAction(async (argv) => {
    if (argv['list-networks']) {
      console.log('Supported networks and their verify API URLs:')
      console.log(networks)
      return
    }
    await globalThis.bre.verify.verifyContract(
      argv.label,
      argv.address
    )
  })

module.exports = globalThis.bre.verify