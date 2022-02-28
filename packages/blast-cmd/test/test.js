const path = require('path')
const fs = require('fs')
const { spawnSync } = require('child_process')
const BlastError = require('../../blast-utilities/blast-error')
const {
  getPackageRootPath,
  getProjectRootPath
} = require('../../blast-utilities/package-info')

const JS_TESTS_FOLDER_NAME = 'tests'
const GLOBAL_FUNCTIONS = path.join(getPackageRootPath(), 'packages/blast-utilities/global-functions.js')
const JEST_BINARY = path.join(getPackageRootPath(), 'node_modules/.bin/jest')

function testCmd(argv) {
  const TEST_DIR = path.join(getProjectRootPath(), JS_TESTS_FOLDER_NAME)
  if (!fs.existsSync(TEST_DIR)) {
    throw new BlastError('No tests folder found! Make sure to place your JavaScript tests in /' +
    JS_TESTS_FOLDER_NAME)
  }
  console.log('Running JavaScript tests...')

  spawnSync(`${JEST_BINARY} ${TEST_DIR} --setupFilesAfterEnv=${GLOBAL_FUNCTIONS} --testTimeout=15000 --silent`, {
    stdio: 'inherit',
    shell: true
  })
}

module.exports = { testCmd: testCmd }
