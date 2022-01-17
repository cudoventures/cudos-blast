const path = require('path')

const { executeRun } = require('../../cudos-utilities/run-docker-commands')

function runUnitTests(argv) {
  try {
    // TODO: the slimbuster img is 604 mb, can we reuse the rust-optimizer to call the test? - So far could not make it
    // work on each test run the docker is downloading the packages again, how can we cache them?
    let cmd = `-v "${path.resolve('.')}":/usr/src/cudos-cli ` +
        '-w /usr/src/cudos-cli rust:1.55-slim-buster cargo test --lib'

    if (argv.quiet) {
      cmd += ' -q'
    }

    executeRun(cmd)
  } catch (ex) {
    console.log(ex.message)
  }
}

async function unitTestCmd(argv) {
  console.log('Running contract unit tests...')
  runUnitTests(argv)
}

module.exports = { unitTestCmd: unitTestCmd }
