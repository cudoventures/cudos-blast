const bre = require('./bre.js')

module.exports = {
  getSigners: bre.getSigners,
  getContractFactory: bre.getContractFactory,
  getContractFromCodeId: bre.getContractFromCodeId,
  getContractFromAddress: bre.getContractFromAddress,
  get assertRevert() { return require('./test-helpers/expectEvent.js') }
}
