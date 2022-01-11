class CudosError extends Error {
  constructor(args) {
    super(args)
    this.name = 'CudosError'
  }
}

module.exports = CudosError
