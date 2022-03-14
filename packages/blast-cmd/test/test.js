const path = require('path')
const fs = require('fs')
const { spawnSync } = require('child_process')
const BlastError = require('../../blast-utilities/blast-error')
const {
  getPackageRootPath,
  getProjectRootPath
} = require('../../blast-utilities/package-info')
const { checkNodeOnline } = require('../../blast-utilities/get-node-status')

const INTEGRATION_TESTS_FOLDER_NAME = 'integration_tests'
const GLOBAL_FUNCTIONS = path.join(getPackageRootPath(), 'packages/blast-utilities/global-functions.js')
const JEST_BINARY = path.join(getPackageRootPath(), 'node_modules/.bin/jest')

async function testCmd(argv) {
  const TEST_DIR = path.join(getProjectRootPath(), INTEGRATION_TESTS_FOLDER_NAME)
  if (!fs.existsSync(TEST_DIR)) {
    throw new BlastError('No integration tests folder found! Make sure to place your integration tests in /' +
      INTEGRATION_TESTS_FOLDER_NAME)
  }
  await checkNodeOnline()
  console.log('Running integration tests...')

  spawnSync(`${JEST_BINARY} ${TEST_DIR} --setupFilesAfterEnv=${GLOBAL_FUNCTIONS} --testTimeout=15000 --silent`, {
    stdio: 'inherit',
    shell: true
  })
}

module.exports = { testCmd: testCmd }
