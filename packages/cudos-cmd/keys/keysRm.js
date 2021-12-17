const VError = require('verror')
const { executeNode } = require('../../cudos-utilities/runDockerCommands')

const keysRmCmd = async function(argv) {
  try {
    if (argv.yes) {
      executeNode(`keys delete ${argv.name} --yes`)
    } else {
      executeNode(`keys delete ${argv.name}`)
    }
  } catch (error) {
    throw new VError(`Cannot remove account ${argv.name}. \nError: ${error.message}`)
  }
}

module.exports = {
  keysRmCmd
}
