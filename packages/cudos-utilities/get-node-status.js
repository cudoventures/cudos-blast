const axios = require('axios').default
const { getEndpoint } = require('./config-utils')
const CudosError = require('./cudos-error')

async function checkNodeOnline() {
  const nodeStatus = await getStatusNode()
  if (!nodeStatus.isConnected) {
    throw new CudosError('Local node is not running.')
  }
}

async function checkNodeOffline() {
  const nodeStatus = await getStatusNode()
  if (nodeStatus.isConnected) {
    throw new CudosError('Local node is already running.')
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
    nodeStatus.statusCode = response.status

    if (nodeStatus.statusCode === 200) {
      if (response.data.result && response.data.result.node_info) {
        // node is up and running
        nodeStatus.isConnected = true
        nodeStatus = attachAddidionalInfo(nodeStatus, response.data.result)
        return nodeStatus
      }
      // probably connected to something other than node
      nodeStatus.isConnected = false
      nodeStatus.message = 'Missing data from node response. Are you sure you connected a node?'
      return nodeStatus
    }
    // status is not 200
    nodeStatus.isConnected = false
    nodeStatus.message = 'Unusual node response. Status code should be 200.'
    return nodeStatus
  } catch (error) {
    if (!error.isAxiosError) {
      throw error
    }
    nodeStatus.isConnected = false
    if (typeof error.response !== 'undefined') {
      nodeStatus.statusCode = error.response.status
      return nodeStatus
    }
    nodeStatus.statusCode = error.code
    return nodeStatus
  }
}

function attachAddidionalInfo(nodeStatus, infoObject) {
  nodeStatus.message = 'Node id: ' + infoObject.node_info.id + '\nNetwork: ' + infoObject.node_info.network
  return nodeStatus
}

module.exports = {
  getStatusNode: getStatusNode,
  checkNodeOnline: checkNodeOnline,
  checkNodeOffline: checkNodeOffline
}
