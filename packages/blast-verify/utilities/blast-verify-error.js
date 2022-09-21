
const BlastError = require('cudos-blast/utilities/blast-error')

class BlastVerifyError extends BlastError {
  constructor(...args) {
    super(...args)
    this.name = this.constructor.name
  }
}

module.exports = BlastVerifyError
