const { fromBech32 } = require('cudosjs')

const isValidAddress = (address, addressPrefix) => {
  try {
    const {
      prefix, data
    } = fromBech32(address)

    if (prefix !== addressPrefix) {
      return false
    }
    return data.length === 20 || data.length === 32
  } catch {
    return false
  }
}

module.exports = { isValidAddress: isValidAddress }
