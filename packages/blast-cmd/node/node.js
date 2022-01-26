const { executeCompose } = require('../../blast-utilities/run-docker-commands')
const {
  getStatusNode,
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

const statusNodeCmd = async function() {
  const nodeStatus = await getStatusNode()
  console.log(nodeStatus.info)
}

module.exports = {
  startNodeCmd: startNodeCmd,
  stopNodeCmd: stopNodeCmd,
  statusNodeCmd: statusNodeCmd
}
