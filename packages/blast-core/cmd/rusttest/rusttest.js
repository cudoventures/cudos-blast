const path = require('path')

const {
  checkDockerStatus,
  executeRun
} = require('../../utilities/run-docker-commands')

async function rustTestCmd(argv) {
  checkDockerStatus()
  console.log('Running contract rust tests...')

  // TODO: the slimbuster img is 604 mb, can we reuse the rust-optimizer to call the test? - So far could not make it
  // work on each test run the docker is downloading the packages again, how can we cache them?
  let cmd = `-v "${path.resolve('.')}":/usr/src/cudos-blast -w /usr/src/cudos-blast ` +
    'rust:1.61-slim-buster cargo test --lib'
  if (argv.quiet) {
    cmd += ' -q'
  }
  executeRun(cmd)
}

module.exports = { rustTestCmd: rustTestCmd }
