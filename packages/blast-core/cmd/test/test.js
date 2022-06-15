const path = require('path')
const fs = require('fs')
const { spawnSync } = require('child_process')
const BlastError = require('../../utilities/blast-error')
const {
  getPackageRootPath,
  getProjectRootPath
} = require('../../utilities/package-info')
const { checkNodeOnline } = require('../../utilities/get-node-status')

const JS_TESTS_FOLDER_NAME = 'tests'
const GLOBALS_PATH = path.join(getPackageRootPath(), 'lib/bre.js')

async function testCmd(argv) {
  const TEST_DIR = path.join(getProjectRootPath(), JS_TESTS_FOLDER_NAME)
  if (!fs.existsSync(TEST_DIR)) {
    throw new BlastError('No tests folder found! Make sure to place your JavaScript tests in /' +
    JS_TESTS_FOLDER_NAME)
  }
  await checkNodeOnline(argv.network)
  const silent = argv.silent ? '--silent' : ''
  console.log('Running JavaScript tests...')

  process.env.BLAST_NETWORK = argv.network ?? ''
  // here JEST uses only initial globals file setup. process.env (not globals) persist through the new spawned process
  spawnSync(`npx --no jest ${TEST_DIR} ` +
    `--setupFilesAfterEnv=${GLOBALS_PATH} --testTimeout=15000 ${silent} --detectOpenHandles`,
  {
    stdio: 'inherit',
    shell: true
  })
}

module.exports = { testCmd: testCmd }
