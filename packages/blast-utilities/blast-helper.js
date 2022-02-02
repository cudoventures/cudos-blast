
async function delay(n) {
  return new Promise(function(resolve) {
    setTimeout(resolve, n * 1000)
  })
}

function transferTokensByNameCommand(fromName, toName, amount) {
  return `cudos-noded tx bank send ${fromName} $(cudos-noded keys show ${toName} -a) ${amount}acudos ` +
    '--chain-id cudos-network --yes'
}

module.exports = {
  delay: delay,
  transferTokensByNameCommand: transferTokensByNameCommand
}
