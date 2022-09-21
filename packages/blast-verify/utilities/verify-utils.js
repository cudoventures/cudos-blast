const archiver = require('archiver')
const fs = require('fs')
const path = require('path')
const { fromBech32 } = require('cudosjs')

const { getProjectRootPath } = require('cudos-blast/utilities/package-info')
const { getConfig } = require('cudos-blast/utilities/config-utils')
const BlastVerifyError = require('./blast-verify-error')
const { ARCHIVE_EXTENTION } = require('../config/verify-constants')
const networks = require('../config/networks-config')

const getVerifyUrlFromNetwork = () => {
  const { config } = getConfig()

  if (!config.verify) {
    throw new BlastVerifyError('Missing [verify] from the config file.')
  }
  if (!config.verify.network) {
    throw new BlastVerifyError('Missing [verify.network] from the config file.')
  }
  if (!networks[config.verify.network]) {
    throw new BlastVerifyError('Invalid network passed in the config file! Use "blast verify --ls" to show ' +
        'all available networks.')
  }
  return networks[config.verify.network]
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

const isValidAddress = (address, addressPrefix) => {
  try {
    const {
      prefix, data
    } = fromBech32(address)

    if (prefix !== addressPrefix) {
      return false
    }
    return data.length === 20 || data.length === 32
  } catch {
    return false
  }
}

module.exports = {
  getVerifyUrlFromNetwork: getVerifyUrlFromNetwork,
  createContractsArchive: createContractsArchive,
  isValidAddress: isValidAddress
}
