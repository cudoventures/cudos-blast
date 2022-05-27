const {
  GasPrice,
  calculateFee
} = require('cudosjs')
const path = require('path')
const fs = require('fs')
const BlastError = require('../utilities/blast-error')
const { getProjectRootPath } = require('../utilities/package-info')
const {
  getNetwork,
  getGasPrice
} = require('../utilities/config-utils')
const { getDefaultLocalSigner } = require('../utilities/network-utils')

module.exports.CudosContract = class CudosContract {
  #label
  #wasmPath
  #codeId
  #contractAddress
  #signer
  #gasPrice

  constructor(contractLabel) {
    this.#label = contractLabel
    this.#gasPrice = GasPrice.fromString(getGasPrice())
  }

  static constructLocal(label) {
    const wasmPath = path.join(getProjectRootPath(), `artifacts/${label}.wasm`)
    if (!fs.existsSync(wasmPath)) {
      throw new BlastError(`Contract with label ${label} was not found. Only compiled contracts can be accepted`)
    }
    const cudosContract = new CudosContract(label)
    cudosContract.#wasmPath = wasmPath
    return cudosContract
  }

  static constructUploaded(codeId, label, signer) {
    const cudosContract = new CudosContract(label)
    cudosContract.#codeId = codeId
    cudosContract.#signer = signer
    return cudosContract
  }

  static constructDeployed(label, codeId, contractAddress, signer) {
    const cudosContract = new CudosContract(label)
    cudosContract.#codeId = codeId
    cudosContract.#contractAddress = contractAddress
    cudosContract.#signer = signer
    return cudosContract
  }

  // Uploads the contract's code to the network
  async uploadCode(options = { signer: null }) {
    if (this.#isUploaded()) {
      throw new BlastError(`Cannot upload contract with  ${null}. Contract is already uploaded`)
    }
    this.#signer = options.signer ?? await getDefaultLocalSigner(getNetwork(process.env.BLAST_NETWORK))
    const uploadTx = await this.#uploadContract(this.#signer)
    this.#codeId = uploadTx.codeId
    return uploadTx
  }

  // Instantiates uploaded code without assigning the new contract to current contract object instance
  async instantiate(msg, options = {
    signer: null, label: null, funds: null
  }) {
    if (!this.#isUploaded()) {
      throw new BlastError('Cannot instantiate contract. Contract is not uploaded. ' +
        'Contract\'s code must exist on the network before instantiating')
    }
    options.signer = options.signer ?? this.#signer
    options.label = options.label ?? this.#label
    const instantiateTx = await this.#instantiateContract(
      options.signer, this.#codeId, msg, options.label, options.funds)
    return instantiateTx
  }

  // Uploads code, instantiates the contract and assign it to current contract object instance
  async deploy(msg, options = {
    signer: null, label: null, funds: null
  }) {
    if (this.#isUploaded()) {
      throw new BlastError(`Cannot deploy contract labeled ${this.#label}. Contract is already uploaded. ` +
      'Only new contracts can be deployed. Use "instantiate" for uploaded contracts')
    }
    this.#signer = options.signer ?? await getDefaultLocalSigner(getNetwork(process.env.BLAST_NETWORK))
    options.label = options.label ?? this.#label
    const uploadTx = await this.#uploadContract(this.#signer)
    this.#codeId = uploadTx.codeId
    const instantiateTx = await this.#instantiateContract(
      this.#signer, uploadTx.codeId, msg, options.label, options.funds)
    this.#label = options.label
    this.#contractAddress = instantiateTx.contractAddress
    return {
      uploadTx: uploadTx,
      initTx: instantiateTx
    }
  }

  async execute(msg, signer = this.#signer) {
    if (!this.#isDeployed()) {
      throw new BlastError(`Cannot execute with message: ${msg}.\nContract is not deployed`)
    }
    const fee = calculateFee(1_500_000, this.#gasPrice)
    return await signer.execute(signer.address, this.#contractAddress, msg, fee)
  }

  async query(msg, signer = this.#signer) {
    if (!this.#isDeployed()) {
      throw new BlastError(`Cannot query with message: ${msg}.\nContract is not deployed`)
    }
    return await signer.queryContractSmart(this.#contractAddress, msg)
  }

  getAddress() {
    if (!this.#isDeployed()) {
      throw new BlastError(`Cannot get address of a contract labeled: ${this.label}. Contract is not deployed`)
    }
    return this.#contractAddress
  }

  getCodeId() {
    if (!this.#isUploaded()) {
      throw new BlastError(`Cannot get code ID of a contract with label: ${this.label}. Contract is not uploaded`)
    }
    return this.#codeId
  }

  getLabel() {
    return this.#label
  }

  // dev
  getSignerAddress() {
    return this.#signer.address
  }

  async #uploadContract(signer) {
    // TODO: pass gasLimit as a param or read it from config
    const wasm = fs.readFileSync(this.#wasmPath)
    const uploadFee = calculateFee(1_500_000, this.#gasPrice)
    return await signer.upload(
      this.#signer.address,
      wasm,
      uploadFee
    )
  }

  async #instantiateContract(signer, codeId, msg, label, funds) {
    const instantiateFee = calculateFee(500_000, this.#gasPrice)
    return await signer.instantiate(
      this.#signer.address,
      codeId,
      msg,
      label,
      instantiateFee,
      { funds: funds }
    )
  }

  #isUploaded() {
    return this.#codeId
  }

  #isDeployed() {
    return this.#contractAddress
  }
}
