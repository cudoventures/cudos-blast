const {
  stopNode,
  startNode
} = require('../../../cmd/lib/commandService')

const {
  getStatusNode
} = require('../../../cmd/lib/status')

const startNodeCmd = async function(argv) {
  startNode(argv.daemon)
}

const stopNodeCmd = function() {
  stopNode()
}

const statusNodeCmd = async function() {
  const nodeStatus = await getStatusNode()
  if (nodeStatus.isConnected) {
    console.log('Connection to node is online.')
    console.log('Node id: ' + nodeStatus.nodeInfo.nodeId + '\nNetwork: ' + nodeStatus.nodeInfo.network)
  } else {
    console.log('Connection to node is offline. Status code: ' + nodeStatus.statusCode)
    if (typeof nodeStatus.errorMessage !== 'undefined') {
      console.log('Error: ' + nodeStatus.errorMessage)
    }
  }
}

// exports.command = 'node'
// exports.describe = 'manage cudo local node'

// exports.builder = (yargs) => {
//   yargs.command('start', 'start node', () => {
//     yargs.option('daemon', {
//       alias: 'd',
//       type: 'boolean',
//       default: false,
//       description: 'Run Node in the background'
//     })
//   }, startNodeCmd)
//     .command('stop', 'stopping node', () => {}, stopNodeCmd)
//     .command('status', 'check node status', () => {}, statusNodeCmd)
//     .demandCommand(1, 'No command specified!') // user must specify atleast one command
// }
module.exports = {
  startNodeCmd: startNodeCmd,
  stopNodeCmd: stopNodeCmd,
  statusNodeCmd: statusNodeCmd
}
