const {
  executeNode,
  executeNodeMultiCmd
} = require('../../cudos-utilities/run-docker-commands')

const keysListCmd = async function() {
  executeNode('keys list')
}

const keysAddCmd = async function(argv) {
  executeNodeMultiCmd(`cudos-noded keys add ${argv.name} && ` + transferTokensByNameCommand(
    'faucet', argv.name, '1000000000000000000'))
}

const keysRmCmd = async function(argv) {
  if (argv.yes) {
    executeNode(`keys delete ${argv.name} --yes`)
  } else {
    executeNode(`keys delete ${argv.name}`)
  }
}

const keysFundCmd = async function(argv) {
  executeNodeMultiCmd(transferTokensByNameCommand('faucet', argv.name, argv.tokens))
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
