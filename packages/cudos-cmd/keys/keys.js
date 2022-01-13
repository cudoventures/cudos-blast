const VError = require('verror')

const {
  executeNode,
  executeNodeMultiCmd
} = require('../../cudos-utilities/run-docker-commands')

const keysListCmd = async function() {
  try {
    executeNode('keys list')
  } catch (error) {
    console.log("Could not fetch keys, is your node online? Execute 'cudo node status' for more info")
  }
}

const keysAddCmd = async function(argv) {
  try {
    executeNodeMultiCmd(`cudos-noded keys add ${argv.name} && ` + transferTokensByNameCommand(
      'faucet', argv.name, '1000000000000000000'))
  } catch (error) {
    throw new VError(`Could not add account ${argv.name}, \nError: ${error.message}`)
  }
}

const keysRmCmd = async function(argv) {
  try {
    if (argv.force) {
      executeNode(`keys delete ${argv.name} --yes`)
    } else {
      executeNode(`keys delete ${argv.name}`)
    }
  } catch (error) {
    throw new VError(`Cannot remove account ${argv.name}. \nError: ${error.message}`)
  }
}

const keysFundCmd = async function(argv) {
  try {
    executeNodeMultiCmd(transferTokensByNameCommand('faucet', argv.name, argv.tokens))
  } catch (error) {
    throw new VError(`Cannot fund account ${argv.name}. \nError: ${error.message}`)
  }
}

function transferTokensByNameCommand(fromName, toName, amount) {
  return `cudos-noded tx bank send ${fromName} $(cudos-noded keys show ${toName} -a) ${amount}acudos ` +
    '--chain-id cudos-network --yes'
}

module.exports = {
  keysListCmd: keysListCmd,
  keysAddCmd: keysAddCmd,
  keysRmCmd: keysRmCmd,
  keysFundCmd: keysFundCmd
}
