const { executeNode } = require('../../cudos-utilities/runDockerCommands')

const keysListCmd = async function() {
  try {
    executeNode('keys list')
  } catch (error) {
    console.log("Could not fetch keys, is your node online? Execute 'cudo node status' for more info")
  }
}

module.exports = {
  keysListCmd
}
