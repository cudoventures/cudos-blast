const Mocha = require('mocha')
const path = require('path')
const fs = require('fs')

const BlastError = require('../../blast-utilities/blast-error')

const mocha = new Mocha()
const INTEGRATION_TESTS_FOLDER_NAME = 'integration_tests'
const testDir = path.join(process.cwd(), INTEGRATION_TESTS_FOLDER_NAME)

function runTest() {
  fs.readdirSync(testDir).filter(function(file) {
    console.log('run test: ', file)
    return file.substring(file.length - 3, file.length) === '.js'
  }).forEach(function(file) {
    mocha.addFile(
      path.join(testDir, file)
    )
  })

  // Run the tests.
  // TODO: this command should be fixed as it does not seems to work.
  mocha.run(function(failures) {
    process.exitCode = failures ? 1 : 0
  })
}

async function testCmd(argv) {
  if (!fs.existsSync(testDir)) {
    throw new BlastError('No integration tests folder found! Make sure to place your integration tests in /' +
      INTEGRATION_TESTS_FOLDER_NAME)
  }
  console.log('Running integration tests...')
  runTest()
}

module.exports = { testCmd: testCmd }
