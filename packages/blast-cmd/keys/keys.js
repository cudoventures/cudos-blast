const {
  executeNode,
  executeNodeMultiCmd
} = require('../../blast-utilities/run-docker-commands')
const { checkNodeOnline } = require('../../blast-utilities/get-node-status')
const { transferTokensByNameCommand } = require('../../blast-utilities/blast-helper')

const keysListCmd = async function() {
  await checkNodeOnline()
  executeNode('keys list')
}

const keysAddCmd = async function(argv) {
  await checkNodeOnline()
  executeNodeMultiCmd(`cudos-noded keys add ${argv.name} && ` + transferTokensByNameCommand(
    'faucet', argv.name, '1000000000000000000'), argv.tty)
}

const keysRmCmd = async function(argv) {
  await checkNodeOnline()
  if (argv.force) {
    executeNode(`keys delete ${argv.name} --yes`)
    return
  }
  executeNode(`keys delete ${argv.name}`, false)
}

const keysFundCmd = async function(argv) {
  await checkNodeOnline()
  executeNodeMultiCmd(transferTokensByNameCommand('faucet', argv.name, argv.tokens))
}

module.exports = {
  keysListCmd: keysListCmd,
  keysAddCmd: keysAddCmd,
  keysRmCmd: keysRmCmd,
  keysFundCmd: keysFundCmd
}
