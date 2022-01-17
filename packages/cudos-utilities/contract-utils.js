const { SigningCosmWasmClient } = require('cudosjs')
const {
  GasPrice,
  calculateFee
} = require('cudosjs')

const path = require('path')
const fs = require('fs')

const {
  getEndpoint,
  getGasPrice,
  getNetwork,
  getDefaultAccount
} = require('./config-utils.js')

const {
  getSigner,
  getAccountAddress
} = require('./keypair.js')

let client

async function getClient(accountName, network) {
  if (!accountName) {
    accountName = await getDefaultAccount()
  }
  if (!network) {
    network = await getNetwork()
  }

  const endpoint = await getEndpoint()
  const wallet = await getSigner(accountName, network)
  client = await SigningCosmWasmClient.connectWithSigner(endpoint, wallet)
  client.name = accountName
}

const Contract = class {
  constructor(contractname, initMsg, label) {
    this.contractname = contractname
    this.initMsg = initMsg
    this.label = label || contractname
  }

  async init() {
    if (!this.deployed) {
      this.wasmPath = ''
      try {
        this.wasmPath = path.join(process.cwd(), `artifacts/${this.contractname}.wasm`)
      } catch (ex) {
        console.error(`Contract with name ${this.contractname} was not found, did you compile it ? \n run cudo --help for more available commands`)
      }
    }

    this.gasPrice = GasPrice.fromString(await getGasPrice())
    this.defaultAccount = await getAccountAddress(client.name)

    return this
  }

  async deploy() {
    const uploadReceipt = await this.uploadContract()
    console.log(uploadReceipt)
    const ic = await this.initContract(uploadReceipt.codeId)
    console.log(ic)
    this.contractAddress = ic.contractAddress
    return ic.contractAddress
  }

  async uploadContract() {
    // TODO: pass gasLimit as a param or read it from config
    const uploadFee = calculateFee(1_500_000, this.gasPrice)
    const wasm = fs.readFileSync(this.wasmPath)

    return await client.upload(
      this.defaultAccount,
      wasm,
      uploadFee
    )
  }

  async initContract(codeId) {
    const instantiateFee = calculateFee(500_000, this.gasPrice)
    return await client.instantiate(
      this.defaultAccount,
      codeId,
      this.initMsg,
      this.label,
      instantiateFee
    )
  }

  addAddress(contractAddress) {
    this.deployed = true
    this.contractAddress = contractAddress
  }

  async execute(msg) {
    const fee = calculateFee(1_500_000, this.gasPrice)
    return await client.execute(this.defaultAccount, this.contractAddress, msg, fee)
  }

  async querySmart(queryMsg) {
    return await client.queryContractSmart(this.contractAddress, queryMsg)
  }
}

async function getContractFactory(contractname, initMsg) {
  const contract = new Contract(contractname, initMsg)
  await contract.init()
  return contract
}

async function getContractFromAddress(contractAddress) {
  const contract = new Contract()
  contract.addAddress(contractAddress)
  await contract.init()
  return contract
}

module.exports = {
  getContractFactory: getContractFactory,
  getContractFromAddress: getContractFromAddress,
  getClient: getClient
}
