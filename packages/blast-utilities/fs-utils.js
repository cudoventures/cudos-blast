const fs = require('fs')
const { getProjectRootPath } = require('./package-info')
const BlastError = require('./blast-error')

function saveAccounts(accounts) {
  const pkgRoot = getProjectRootPath()
  try {
    fs.writeFileSync(`${pkgRoot}/cusotm-accounts.json`, JSON.stringify(accounts))
  } catch (error) {
    throw new BlastError(`Failed to create file at ${pkgRoot}/additional-accounts.json with error: ${error}`)
  }
}

module.exports = {
  saveAccounts: saveAccounts
}
