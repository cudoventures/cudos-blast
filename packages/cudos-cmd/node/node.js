const { executeCompose } = require('../../cudos-utilities/run-docker-commands')
const {
  getStatusNode,
  checkNodeOnline,
  checkNodeOffline
} = require('../../cudos-utilities/get-node-status')

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

const statusNodeCmd = async function() {
  const nodeStatus = await getStatusNode()
  if (nodeStatus.isConnected) {
    console.log('Node is online.')
  }
  if (!nodeStatus.isConnected) {
    console.log('Node is offline.\nStatus code: ' + nodeStatus.statusCode)
  }
  if (typeof nodeStatus.message !== 'undefined') {
    console.log(nodeStatus.message)
  }
}

module.exports = {
  startNodeCmd: startNodeCmd,
  stopNodeCmd: stopNodeCmd,
  statusNodeCmd: statusNodeCmd
}
