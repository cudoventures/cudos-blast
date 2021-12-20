const fs = require('fs')

const fsExtra = require('fs-extra')
const path = require('path')

const { getPackageRoot } = require('../../cudos-utilities/packageInfo')

async function initCmd(argv) {
  if (argv.dir !== undefined && argv.dir !== '' && argv.dir !== '.') {
    handleCustomDirCreation(argv)
  }

  try {
    await fsExtra.copy(
      path.join(getPackageRoot(), 'template'),
      argv.dir
    )
  } catch (error) {
    console.log('Error copying folder', error)
  }

  console.log(`Success! Sample project initialized in ${argv.dir !== '.' ? argv.dir : process.cwd()}`)
}

function handleCustomDirCreation(argv) {
  if (!fs.existsSync(argv.dir)) {
    try {
      console.log('Directory does not exist, creating and initializing it...')
      fs.mkdirSync(argv.dir, { recursive: true })
    } catch {
      console.log('Directory does not exist and was not able to create it, please check your write permissions and/or path itself')
    }
  }
}

module.exports.initCmd = initCmd
