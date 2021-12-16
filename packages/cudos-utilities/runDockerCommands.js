const {
  spawnSync
} = require('child_process')

const {
  getDockerComposeInitFile,
  getDockerComposeStartFile
} = require('./packageInfo')

const dockerComposeCmd = `docker-compose -f ${getDockerComposeStartFile()} -f ${getDockerComposeInitFile()} `
const dockerRunCmd = 'docker run --rm '
const nodeCmd = 'exec cudos-node cudos-noded '
const nodeMultiCmd = 'exec cudos-node sh -c '

const runCommand = function(cmd) {
  const childResult = spawnSync(cmd, {
    stdio: 'inherit',
    shell: true
  })
  if (childResult.status !== 0) {
    console.log('Command to the local node failed!')
  }
}

const executeCompose = function(arg) {
  runCommand(dockerComposeCmd + arg)
}

const executeRun = function(arg) {
  runCommand(dockerRunCmd + arg)
}

const executeNode = function(arg) {
  runCommand(dockerComposeCmd + nodeCmd + arg)
}

const executeNodeMultiCmd = function(arg) {
  runCommand(dockerComposeCmd + nodeMultiCmd + `'${arg}'`)
}

module.exports = {
  executeCompose,
  executeRun,
  executeNode,
  executeNodeMultiCmd
}
