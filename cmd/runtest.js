const Mocha = require('mocha')
const path = require('path')
const fs = require('fs')

const mocha = new Mocha()

const testDir = path.join(process.cwd(), 'integration_tests')

function runTest () {
  fs.readdirSync(testDir).filter(function (file) {
    console.log('run test: ', file)
    return file.substr(-3) === '.js'
  }).forEach(function (file) {
    mocha.addFile(
      path.join(testDir, file)
    )
  })

  // Run the tests.
  mocha.run(function (failures) {
    process.exitCode = failures ? 1 : 0
  })
}

async function testCmd (argv) {
  console.log('run tests')
  runTest()
}

module.exports.testCmd = testCmd
