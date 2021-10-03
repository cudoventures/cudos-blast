import fs from 'fs'
import vm from 'vm'
import path from 'path'

import { getContractFactory, getContractFromAddress } from './lib/contract'

global.getContractFactory = getContractFactory
global.getContractFromAddress = getContractFromAddress

export async function runCmd (argv) {
  if (argv.scriptFilePath === undefined || argv.scriptFilePath === '') {
    console.error('You must specify a scriptfile path to run. Execute cudo run --help for more info')
    return
  }
  if (!fs.existsSync(`${path.resolve('.')}/${argv.scriptFilePath}`)) {
    console.log(`Script at location ${path.resolve('.')}/${argv.scriptFilePath} does not exist. Execute cudo run --help for more info.`)
    return
  }

  const ds = new vm.Script(fs.readFileSync(argv.scriptFilePath))
  await ds.runInThisContext()
}
