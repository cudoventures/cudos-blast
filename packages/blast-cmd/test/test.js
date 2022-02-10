const path = require('path')
const fs = require('fs')
const { spawnSync } = require('child_process')
const BlastError = require('../../blast-utilities/blast-error')
const { getPackageRootPath } = require('../../blast-utilities/package-info')

const INTEGRATION_TESTS_FOLDER_NAME = 'integration_tests'
const TEST_DIR = path.join(process.cwd(), INTEGRATION_TESTS_FOLDER_NAME)
const MOCHA_BINARY = getPackageRootPath() + '/node_modules/mocha/bin/mocha '

function testCmd(argv) {
  if (!fs.existsSync(TEST_DIR)) {
    throw new BlastError('No integration tests folder found! Make sure to place your integration tests in /' +
      INTEGRATION_TESTS_FOLDER_NAME)
  }
  console.log('Running integration tests...')
  
  spawnSync(MOCHA_BINARY + TEST_DIR + ' -r ../packages/blast-cmd/run/run.js --timeout 100000', {
    stdio: 'inherit',
    shell: true
  })
}

module.exports = { testCmd: testCmd }
