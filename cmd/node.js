import { stopNode, startNode, statusNode, keysNode } from './lib/commandService'

async function startNodeCmd (argv) {
  startNode(argv.daemon)
}

function stopNodeCmd () {
  stopNode()
}

function statusNodeCmd () {
  try {
    statusNode()
    console.log('Node is online!')
  } catch (ex) {
    console.log('Node is offline!')
  }
}

async function keysNodeCmd () {
  try {
    keysNode()
  } catch {
    console.log("Could not fetch keys, is your node online? Execute 'cudo node status' for more info")
  }
}

exports.command = 'node'
exports.describe = 'manage cudo local node'

exports.builder = (yargs) => {
  yargs.command('start', 'start node', () => {
    yargs.option('daemon', {
      alias: 'd',
      type: 'boolean',
      default: false,
      description: 'Run Node in the background'
    })
  }, startNodeCmd)
    .command('stop', 'stopping node', () => {}, stopNodeCmd)
    .command('status', 'check node status', () => {}, statusNodeCmd)
    .command('keys', 'list keys', () => {}, keysNodeCmd)
}
