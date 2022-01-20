class BlastError extends Error {
  constructor(...args) {
    super(...args)
    this.name = this.constructor.name
  }
}

module.exports = BlastError
