const VError = require('verror')
const {
  executeNodeMultiCmd,
  transferTokensByNameCommand
} = require('../../cudos-utilities/runDockerCommands')

const keysAddCmd = async function(argv) {
  try {
    executeNodeMultiCmd(`cudos-noded keys add ${argv.name} && ` + transferTokensByNameCommand(
      'faucet', argv.name, '1000000000000000000'))
  } catch (error) {
    throw new VError(`Could not add account ${argv.name}, \nError: ${error.message}`)
  }
}

module.exports = {
  keysAddCmd
}
