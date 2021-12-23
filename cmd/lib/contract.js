const {
  SigningCosmWasmClient
} = require('cudosjs')

const {
  GasPrice, calculateFee
} = require('cudosjs')

const path = require('path')
const fs = require('fs')

const {
  getEndpoint,
  getConfig
} = require('./config')

const {
  keystore
} = require('./keystore')

async function getClient() {
  const endpoint = await getEndpoint()
  // TODO: pass account as a param
  const wallet = await keystore.getSigner('account1')
  return await SigningCosmWasmClient.connectWithSigner(endpoint, wallet)
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

    const {
      config
    } = await getConfig()
    this.config = config

    if (!config.gasPrice) {
      console.log('Missing [gasPrice] field in the config file.')
      process.exit(1)
    }
    this.gasPrice = GasPrice.fromString(config.gasPrice)

    this.client = await getClient()
    this.config.defaultAccount = await keystore.getAccountAddress(config.defaultAccount.name)

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
    const uploadFee = calculateFee(1_500_000, this.gasPrice)
    const wasm = fs.readFileSync(this.wasmPath)

    return await this.client.upload(
      this.config.defaultAccount,
      wasm,
      uploadFee
    )
  }

  async initContract(codeId) {
    const instantiateFee = calculateFee(500_000, this.gasPrice)
    return await this.client.instantiate(
      this.config.defaultAccount,
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
    return await this.client.execute(this.config.defaultAccount, this.contractAddress, msg, fee)
  }

  async querySmart(queryMsg) {
    return await this.client.queryContractSmart(this.contractAddress, queryMsg)
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
  getContractFromAddress: getContractFromAddress
}
