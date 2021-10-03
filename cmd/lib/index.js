const { exec, execSync } = require('child_process')

const math = require('@cosmjs/math')
const protoSigning = require('@cosmjs/proto-signing')

const calculateFee = function calculateFee (gasLimit, { denom, amount: gasPriceAmount }) {
  const amount = Math.ceil(gasPriceAmount.multiply(new math.Uint53(gasLimit)).toFloatApproximation())
  return {
    amount: protoSigning.coins(amount, denom),
    gas: gasLimit.toString()
  }
}

const execCmd = function execCmd (cmd) {
  exec(cmd, function (error, stdout, stderr) {
    console.log(stdout)
    if (error !== null) {
      console.log(stderr)
    }
  })
}

const keypair = require('./keypair')
const { keystore } = require('./keystore')

const commandService = require('./commandService')

module.exports.execCmd = execCmd
module.exports.execSyncCmd = execSync
module.exports.calculateFee = calculateFee
exports.keypair = keypair
exports.keystore = keystore
exports.commandService = commandService
