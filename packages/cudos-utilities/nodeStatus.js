const axios = require('axios').default
const { getEndpoint } = require('./config-utils')

async function getStatusNodeByUrl(url) {
  let nodeStatus = {}
  try {
    const response = await axios.get(url + '/status')
    nodeStatus.statusCode = response.status

    if (nodeStatus.statusCode === 200) {
      if (typeof response.data.result.node_info === 'undefined') {
        nodeStatus.isConnected = false
        nodeStatus.errorMessage = 'Missing data from node response. Are you sure you connected a node?'
        return nodeStatus
      }
      // node is up and running
      nodeStatus.isConnected = true
      nodeStatus = attachAddidionalInfo(nodeStatus, response.data.result)
      return nodeStatus
    }
    // status is not 200
    nodeStatus.isConnected = false
    return nodeStatus
  } catch (ex) {
    nodeStatus.isConnected = false
    if (typeof ex.code !== 'undefined') {
      nodeStatus.statusCode = ex.code
      return nodeStatus
    }
    nodeStatus.statusCode = 'UNKNOWN'
    return nodeStatus
  }
}

async function getStatusNode() {
  const url = await getEndpoint()
  return await getStatusNodeByUrl(url)
}

function attachAddidionalInfo(nodeStatus, infoObject) {
  nodeStatus.nodeInfo = {
    nodeId: infoObject.node_info.id,
    network: infoObject.node_info.network
  }
  return nodeStatus
}

module.exports = {
  getStatusNode: getStatusNode
}
