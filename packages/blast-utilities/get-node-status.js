const axios = require('axios').default
const { getEndpoint } = require('./config-utils')
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

async function getNodeStatus() {
  const url = getEndpoint()
  return await getNodeStatusByUrl(url)
}

async function getNodeStatusByUrl(url) {
  try {
    const response = await axios.get(url + '/status')

    if (response.status === 200) {
      if (response.data.result && response.data.result.node_info) {
        // node is up and running
        const nodeStatus = {}
        nodeStatus.isConnected = true
        nodeStatus.info = 'Node is online.\n' + 'Node id: ' + response.data.result.node_info.id + '\nNetwork: ' +
          response.data.result.node_info.network
        return nodeStatus
      }
      // probably connected to something other than node
      return nodeInfoOffline(response.status, 'Missing data from node response. Are you sure you connected a node?')
    }
    // status is not 200
    return nodeInfoOffline(response.status, 'Unusual node response. Status code should be 200.')
  } catch (error) {
    if (!error.isAxiosError) {
      throw error
    }
    // get status code either from axios response or axios error
    if (typeof error.response !== 'undefined') {
      return nodeInfoOffline(error.response.status)
    }
    return nodeInfoOffline(error.code)
  }
}

function nodeInfoOffline(statusCode, additionalInfo) {
  const nodeStatus = {}
  nodeStatus.isConnected = false
  nodeStatus.info = 'Node is offline.\nStatus code: ' + statusCode
  if (additionalInfo) {
    nodeStatus.info += '\n' + additionalInfo
  }
  return nodeStatus
}

module.exports = {
  getNodeStatus: getNodeStatus,
  checkNodeOnline: checkNodeOnline,
  checkNodeOffline: checkNodeOffline
}
