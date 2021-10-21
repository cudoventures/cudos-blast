const axios = require("axios").default;
const {
  getEndpoint
} = require("./config")

async function getStatusNodeByUrl(url) {
  let nodeStatus = {};
  try {
    const response = await axios.get(url + "/status");
    nodeStatus.statusCode = response.status;

    response.data.result.node_info = undefined;

    if (nodeStatus.statusCode == 200 && typeof response.data.result.node_info != "undefined"){
      nodeStatus.isConnected = true;
      nodeStatus = attachAddidionalInfo(nodeStatus, response.data.result); 
    } else {
      nodeStatus.isConnected = false;
    }
  } catch (ex) {
    nodeStatus.isConnected = false;
    if (ex.code != undefined){
      nodeStatus.statusCode = ex.code;
    } else {
      nodeStatus.statusCode = "UNKNOWN";
    }
  }
  return nodeStatus;
}

async function getStatusNode(){
  let url = await getEndpoint();
  return await getStatusNodeByUrl(url);
}

function attachAddidionalInfo(nodeStatus, infoObject){
  nodeStatus.nodeInfo = {
    nodeId: infoObject.node_info.id,
    network: infoObject.node_info.network
  }
  return nodeStatus;
}

module.exports = {
  getStatusNode: getStatusNode
}
