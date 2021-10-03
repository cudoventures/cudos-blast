import { exec, execSync } from 'child_process'

import math from '@cosmjs/math'
import protoSigning from '@cosmjs/proto-signing'

export function calculateFee (gasLimit, { denom, amount: gasPriceAmount }) {
  const amount = Math.ceil(gasPriceAmount.multiply(new math.Uint53(gasLimit)).toFloatApproximation())
  return {
    amount: protoSigning.coins(amount, denom),
    gas: gasLimit.toString()
  }
}

export function execCmd (cmd) {
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

module.exports.execSyncCmd = execSync
module.exports.calculateFee = calculateFee
exports.keypair = keypair
exports.keystore = keystore
exports.commandService = commandService
