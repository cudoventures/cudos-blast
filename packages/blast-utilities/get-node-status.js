const axios = require('axios').default
const { getEndpoint } = require('./config-utils')
const BlastError = require('./blast-error')

async function checkNodeOnline() {
  const nodeStatus = await getStatusNode()
  if (!nodeStatus.isConnected) {
    throw new BlastError('Local node is not running.')
  }
}

async function checkNodeOffline() {
  const nodeStatus = await getStatusNode()
  if (nodeStatus.isConnected) {
    throw new BlastError('Local node is already running.')
  }
}

async function getStatusNode() {
  const url = getEndpoint()
  return await getStatusNodeByUrl(url)
}

async function getStatusNodeByUrl(url) {
  let nodeStatus = {}
  try {
    const response = await axios.get(url + '/status')

    if (response.status === 200) {
      if (response.data.result && response.data.result.node_info) {
        // node is up and running
        nodeStatus = attachOnlineInfo(nodeStatus, response.data.result)
        return nodeStatus
      }
      // probably connected to something other than node
      nodeStatus = attachOfflineInfo(nodeStatus, response.status)
      nodeStatus.message = 'Missing data from node response. Are you sure you connected a node?'
      return nodeStatus
    }
    // status is not 200
    nodeStatus = attachOfflineInfo(nodeStatus, response.status)
    nodeStatus.message = 'Unusual node response. Status code should be 200.'
    return nodeStatus
  } catch (error) {
    if (!error.isAxiosError) {
      throw error
    }
    // get node status cods either from axios response or axios error
    if (typeof error.response !== 'undefined') {
      nodeStatus = attachOfflineInfo(nodeStatus, error.response.status)
      return nodeStatus
    }
    nodeStatus = attachOfflineInfo(nodeStatus, error.code)
    return nodeStatus
  }
}

function attachOnlineInfo(nodeStatus, infoObject) {
  nodeStatus.isConnected = true
  nodeStatus.info = 'Node is online.'
  nodeStatus.message = 'Node id: ' + infoObject.node_info.id + '\nNetwork: ' + infoObject.node_info.network
  return nodeStatus
}

function attachOfflineInfo(nodeStatus, statusCode) {
  nodeStatus.isConnected = false
  nodeStatus.info = 'Node is offline.\nStatus code: ' + statusCode
  return nodeStatus
}

module.exports = {
  getStatusNode: getStatusNode,
  checkNodeOnline: checkNodeOnline,
  checkNodeOffline: checkNodeOffline
}
