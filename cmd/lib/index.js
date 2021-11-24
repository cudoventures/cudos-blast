/* eslint camelcase: 1 */

const {
  exec,
  execSync
} = require('child_process')

const math_1 = require('cudosjs')
const proto_signing_1 = require('cudosjs')

const calculateFee = function calculateFee (gasLimit, {
  denom,
  amount: gasPriceAmount
}) {
  const amount = Math.ceil(gasPriceAmount.multiply(new math_1.Uint53(gasLimit)).toFloatApproximation())
  return {
    amount: proto_signing_1.coins(amount, denom),
    gas: gasLimit.toString()
  }
}

const execCmd = function execCmd (cmd) {
  exec(cmd,
    function (error, stdout, stderr) {
      console.log(stdout)
      if (error !== null) {
        console.log(stderr)
      }
    })
}

const keypair = require('./keypair')
const {
  keystore
} = require('./keystore')

const commandService = require('./commandService')
const client = require('./client')

module.exports.execCmd = execCmd
module.exports.execSyncCmd = execSync
module.exports.calculateFee = calculateFee
exports.keypair = keypair
exports.keystore = keystore
exports.commandService = commandService
exports.client = client
