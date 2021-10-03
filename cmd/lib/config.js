/* eslint no-prototype-builtins: "off" */

import fsExstra from 'fs-extra'
import process from 'process'
import path from 'path'

let config = {}

const configPath = path.join(process.cwd(), 'cudos.config.js')

// async function checkConfig () {
//   const config = await getConfig()
// }

export async function getConfig () {
  if (await fsExstra.pathExists(configPath)) {
    config = require(configPath)
  } else {
    console.log(`Config file was not found! Make sure that cudos.config.js exists at ${configPath}`)
    process.exit(1)
  }

  return config
}

export async function getEndpoint () {
  const { config } = await getConfig()

  if (!config.hasOwnProperty('endpoint')) {
    throw new Error('Missing [endpoint] in the config file.')
  }

  return config.endpoint
}
