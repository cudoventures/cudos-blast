
async function delay(n) {
  return new Promise(function(resolve) {
    setTimeout(resolve, n * 1000)
  })
}

function transferTokensByNameCommand(fromName, toName, amount) {
  return `cudos-noded tx bank send ${fromName} $(cudos-noded keys show ${toName} --keyring-backend test -a) ` +
    `${amount}acudos --keyring-backend test --chain-id cudos-network --yes`
}

module.exports = {
  delay: delay,
  transferTokensByNameCommand: transferTokensByNameCommand
}
