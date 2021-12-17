const VError = require('verror')
const {
  executeNodeMultiCmd,
  transferTokensByNameCommand
} = require('../../cudos-utilities/runDockerCommands')

const keysFundCmd = async function(argv) {
  try {
    executeNodeMultiCmd(transferTokensByNameCommand('faucet', argv.name, argv.tokens))
  } catch (error) {
    throw new VError(`Cannot fund account ${argv.name}. \nError: ${error.message}`)
  }
}

module.exports = {
  keysFundCmd
}
