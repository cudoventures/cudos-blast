const fs = require('fs')
const { getProjectRootPath } = require('./package-info')
const BlastError = require('./blast-error')

function saveAccounts(accounts) {
  const pkgRoot = getProjectRootPath()
  const parsed = JSON.parse(accounts)
  try {
    fs.writeFileSync(`${pkgRoot}/accounts.json`, JSON.stringify(parsed, 0, 4))
  } catch (error) {
    throw new BlastError(`Failed to create file at ${pkgRoot}/additional-accounts.json with error: ${error}`)
  }
}

module.exports = {
  saveAccounts: saveAccounts
}
