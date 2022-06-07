const {
  GasPrice,
  calculateFee
} = require('cudosjs')
const path = require('path')
const fs = require('fs')
const BlastError = require('../utilities/blast-error')
const { getProjectRootPath } = require('../utilities/package-info')
const { getGasPrice } = require('../utilities/config-utils')
const { getDefaultSigner } = require('../utilities/network-utils')

module.exports.CudosContract = class CudosContract {
  #contractLabel
  #signer
  #contractAddress
  #wasmPath
  #gasPrice

  constructor(contractLabel, signer, deployedContractAddress = null) {
    this.#contractLabel = contractLabel
    this.#signer = signer
    this.#contractAddress = deployedContractAddress
    this.#gasPrice = GasPrice.fromString(getGasPrice())

    if (deployedContractAddress === null) {
      this.#wasmPath = path.join(getProjectRootPath(), `artifacts/${contractLabel}.wasm`)
      if (!fs.existsSync(this.#wasmPath)) {
        throw new BlastError(`Contract with label ${contractLabel} was not found, did you compile it?`)
      }
    }
  }

  async deploy(initMsg, options = {}) {
    if (options.signer) {
      this.#signer = options.signer
    }
    if (!options.signer && this.#contractAddress === null) {
      this.#signer = await getDefaultSigner()
    }
    if (!options.label) {
      options.label = this.#contractLabel
    }
    const uploadTx = await this.#uploadContract()
    const initTx = await this.#initContract(uploadTx.codeId, initMsg, this.#contractLabel, options.funds)
    this.#contractAddress = initTx.contractAddress
    return {
      uploadTx: uploadTx,
      initTx: initTx
    }
  }

  async execute(msg, signer = this.#signer) {
    const fee = calculateFee(1_500_000, this.#gasPrice)
    return signer.execute(signer.address, this.#contractAddress, msg, fee)
  }

  async query(queryMsg, signer = this.#signer) {
    return signer.queryContractSmart(this.#contractAddress, queryMsg)
  }

  getAddress() {
    return this.#contractAddress
  }

  async #uploadContract() {
    // TODO: pass gasLimit as a param or read it from config
    const wasm = fs.readFileSync(this.#wasmPath)
    const uploadFee = calculateFee(1_500_000, this.#gasPrice)
    return this.#signer.upload(
      this.#signer.address,
      wasm,
      uploadFee
    )
  }

  async #initContract(codeId, initMsg, label, funds) {
    const instantiateFee = calculateFee(500_000, this.#gasPrice)
    return this.#signer.instantiate(
      this.#signer.address,
      codeId,
      initMsg,
      label,
      instantiateFee,
      { funds: funds }
    )
  }
}
