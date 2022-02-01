const fs = require('fs')

const { getProjectRootPath } = require('./package-info')
function saveAccounts(accounts) {
  const pkgRoot = getProjectRootPath()
  fs.writeFileSync(`${pkgRoot}/additional-accounts.json`, JSON.stringify(accounts))
}

module.exports = {
  saveAccounts: saveAccounts
}
