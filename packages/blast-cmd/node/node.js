const { executeCompose } = require('../../blast-utilities/run-docker-commands')
const {
  getNodeStatus,
  checkNodeOnline,
  checkNodeOffline
} = require('../../blast-utilities/get-node-status')

const startNodeCmd = async function(argv) {
  await checkNodeOffline()
  if (argv.daemon) {
    executeCompose('up --build -d')
    return
  }
  executeCompose('up --build')
}

const stopNodeCmd = async function() {
  await checkNodeOnline()
  executeCompose('down')
}

const nodeStatusCmd = async function() {
  const nodeStatus = await getNodeStatus()
  console.log(nodeStatus.info)
}

module.exports = {
  startNodeCmd: startNodeCmd,
  stopNodeCmd: stopNodeCmd,
  nodeStatusCmd: nodeStatusCmd
}
