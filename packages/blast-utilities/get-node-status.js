const axios = require('axios').default
const { getNodeUrl } = require('./config-utils')
const BlastError = require('./blast-error')

async function checkNodeOnline() {
  const nodeStatus = await getNodeStatus()
  if (!nodeStatus.isConnected) {
    throw new BlastError('Local node is not running.')
  }
}

async function checkNodeOffline() {
  const nodeStatus = await getNodeStatus()
  if (nodeStatus.isConnected) {
    throw new BlastError('Local node is already running.')
  }
}

async function getNodeStatus(network) {
  const url = getNodeUrl(network)
  return await getNodeStatusByUrl(url)
}

async function getNodeStatusByUrl(url) {
  try {
    const response = await axios.get(url + '/status')

    if (response.status === 200) {
      if (response.data.result && response.data.result.node_info) {
        // node is up and running
        return nodeInfo(true, 'Node id: ' + response.data.result.node_info.id + '\nNetwork: ' +
          response.data.result.node_info.network)
      }
      // probably connected to something other than node
      return nodeInfo(false, 'Missing data from node response. Are you sure you connected a node?')
    }
    // status is not 200
    return nodeInfo(false, 'Status code: ' + response.status + '\nUnusual node response. Status code should be 200.')
  } catch (error) {
    if (!error.isAxiosError) {
      throw error
    }
    // get status code either from axios response or axios error
    if (typeof error.response !== 'undefined') {
      return nodeInfo(false, 'Status code: ' + error.response.status)
    }
    return nodeInfo(false, 'Status code: ' + error.code)
  }
}

function nodeInfo(isOnline, additionalInfo) {
  const nodeStatus = {}
  nodeStatus.isConnected = isOnline
  nodeStatus.info = (isOnline ? 'Node is online.\n' : 'Node is offline.\n') + additionalInfo
  return nodeStatus
}

module.exports = {
  getNodeStatus: getNodeStatus,
  checkNodeOnline: checkNodeOnline,
  checkNodeOffline: checkNodeOffline
}
