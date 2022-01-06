const { executeCompose } = require('../../cudos-utilities/run-docker-commands')
const { getStatusNode } = require('../../cudos-utilities/get-node-status')

const startNodeCmd = async function(argv) {
  if (argv.daemon) {
    executeCompose('up --build -d')
    return
  }
  executeCompose('up --build')
}

const stopNodeCmd = async function() {
  const nodeStatus = await getStatusNode()

  if (!nodeStatus.isConnected) {
    console.log('Node is stopped.')
    return
  }
  executeCompose('down')
}

const statusNodeCmd = async function() {
  const nodeStatus = await getStatusNode()
  if (nodeStatus.isConnected) {
    console.log('Connection to node is online.')
    console.log('Node id: ' + nodeStatus.nodeInfo.nodeId + '\nNetwork: ' + nodeStatus.nodeInfo.network)
    return
  }
  console.log('Connection to node is offline. Status code: ' + nodeStatus.statusCode)
  if (typeof nodeStatus.errorMessage !== 'undefined') {
    console.log('Error: ' + nodeStatus.errorMessage)
  }
}

module.exports = {
  startNodeCmd: startNodeCmd,
  stopNodeCmd: stopNodeCmd,
  statusNodeCmd: statusNodeCmd
}
