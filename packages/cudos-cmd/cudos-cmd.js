#!/usr/bin/env node

const {
  hideBin
} = require('yargs/helpers')
const {
  commands
} = require('./commands')

async function main() {
  const args = hideBin(process.argv)
  commands(args)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(`${error}`)
    process.exit(1)
  })
