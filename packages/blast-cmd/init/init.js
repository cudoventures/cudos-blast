const fs = require('fs')
const fsExtra = require('fs-extra')
const path = require('path')

const { getPackageRootPath } = require('../../blast-utilities/package-info')
const BlastError = require('../../blast-utilities/blast-error')

async function initCmd(argv) {
  handleCustomDirCreation(argv)
  try {
    await fsExtra.copy(
      path.join(getPackageRootPath(), 'template'),
      argv.dir
    )
  } catch (error) {
    throw new BlastError(`Error copying folder: ${error}`)
  }

  console.log(`Success! Sample project initialized in ${argv.dir !== '.' ? argv.dir : process.cwd()}`)
}

function handleCustomDirCreation(argv) {
  if (argv.dir !== undefined && argv.dir !== '' && argv.dir !== '.' && !fs.existsSync(argv.dir)) {
    console.log('Directory does not exist, creating and initializing it...')
    try {
      fs.mkdirSync(argv.dir, { recursive: true })
    } catch (error) {
      throw new BlastError(`Error creating new directory: ${error}`)
    }
  }
}

module.exports = { initCmd: initCmd }
