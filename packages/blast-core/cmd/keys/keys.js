const {
  executeNode,
  executeNodeMultiCmd
} = require('../../utilities/run-docker-commands')
const { checkNodeOnline } = require('../../utilities/get-node-status')
const { transferTokensByNameCommand } = require('../../utilities/blast-helper')

const keysListCmd = async function() {
  await checkNodeOnline()
  executeNode('keys list --keyring-backend test')
}

const keysAddCmd = async function(argv) {
  await checkNodeOnline()
  executeNodeMultiCmd(`cudos-noded keys add ${argv.name} --keyring-backend test && ` + transferTokensByNameCommand(
    'faucet', argv.name, '1000000000000000000'), argv.tty)
}

const keysRmCmd = async function(argv) {
  await checkNodeOnline()
  if (argv.force) {
    executeNode(`keys delete ${argv.name} --keyring-backend test --yes`)
    return
  }
  executeNode(`keys delete ${argv.name} --keyring-backend test`, false)
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
