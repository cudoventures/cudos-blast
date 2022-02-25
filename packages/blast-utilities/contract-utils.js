const {
  GasPrice,
  calculateFee
} = require('cudosjs')
const path = require('path')
const fs = require('fs')
const { getGasPrice } = require('./config-utils')
const BlastError = require('./blast-error')
const { getProjectRootPath } = require('./package-info')

module.exports.CudosContract = class CudosContract {
  #contractName
  #owner
  #contractAddress
  #wasmPath
  #gasPrice
  
  constructor(contractName, owner, deployedContractAddress = null) {
    this.#contractName = contractName
    this.#owner = owner
    this.#contractAddress = deployedContractAddress
    this.#wasmPath = path.join(getProjectRootPath(), `artifacts/${contractName}.wasm`)
    this.#gasPrice = GasPrice.fromString(getGasPrice())

    if (!this.#isDeployed() && !fs.existsSync(this.#wasmPath)) {
      throw new BlastError(`Contract with name ${contractName} was not found, did you compile it?`)
    }
  }

  async deploy(initMsg, owner = this.#owner, label = this.#contractName) {
    if (this.#isDeployed()) {
      throw new BlastError(`Contract is already deployed!`)
    }
    
    this.#owner = owner
    const uploadReceipt = await this.#uploadContract()
    const initReceipt = await this.#initContract(uploadReceipt.codeId, initMsg, label)
    this.#contractAddress = initReceipt.contractAddress
    return initReceipt.contractAddress
  }

  async execute(msg, sender = this.#owner) {
    const fee = calculateFee(1_500_000, this.#gasPrice)
    return await sender.execute(sender.address, this.#contractAddress, msg, fee)
  }

  async query(queryMsg, sender = this.#owner) {
    return await sender.queryContractSmart(this.#contractAddress, queryMsg)
  }

  getAddress() {
    return this.#contractAddress
  }

  async #uploadContract() {
    // TODO: pass gasLimit as a param or read it from config
    const wasm = fs.readFileSync(this.#wasmPath)
    const uploadFee = calculateFee(1_500_000, this.#gasPrice)
    return await this.#owner.upload(
      this.#owner.address,
      wasm,
      uploadFee
    )
  }

  async #initContract(codeId, initMsg, label) {
    const instantiateFee = calculateFee(500_000, this.#gasPrice)
    return await this.#owner.instantiate(
      this.#owner.address,
      codeId,
      initMsg,
      label,
      instantiateFee
    )
  }

  #isDeployed() {
    return this.#contractAddress !== null
  }
}