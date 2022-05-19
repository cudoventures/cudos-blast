const cowsay = require('cowsay')

const cow = {}

function dwarfHello() {
  console.log('Halarya! Plugin is loaded.')
}

// const cowDwarfHello = function(text) {
//   if (text) {
//     console.log(cowsay.say({ text: 'Halarya! ' + text }))
//   } else {
//     console.log(cowsay.say({ text: 'Halarya!' }))
//   }
// }

cow.cowSayContractAddress = function(contract) {
  if (contract.getAddress()) {
    console.log(cowsay.say({ text: contract.getAddress() }))
  } else {
    console.log(cowsay.say({ text: 'No address!' }))
  }
}

cow.cowSayMoo = function() {
  console.log(cowsay.say({ text: 'Moooo!' }))
}

// const getContractAddress = function(contract) {
//   if (contract.getAddress()) {
//     return 'Yayyy ' + contract.getAddress()
//   } else {
//     return 'Nayyy, no address'
//   }
// }

dwarfHello()

globalThis.cow = cow
globalThis.bre.cow = cow

module.exports = cow
