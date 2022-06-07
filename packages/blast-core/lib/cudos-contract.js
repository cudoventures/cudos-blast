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
const {
  getDefaultLocalSigner,
  getContractInfo,
  getCodeDetails
} = require('../utilities/network-utils')

module.exports.CudosContract = class CudosContract {
  #label
  #wasmPath
  #codeId
  #contractAddress
  #creator
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

  static async constructUploaded(codeId) {
    const codeDetails = await getCodeDetails(getNetwork(process.env.BLAST_NETWORK), codeId)
    const cudosContract = new CudosContract()
    cudosContract.#codeId = codeId
    cudosContract.#creator = codeDetails.creator
    return cudosContract
  }

  static async constructDeployed(contractAddress) {
    const contractInfo = await getContractInfo(getNetwork(process.env.BLAST_NETWORK), contractAddress)
    const cudosContract = new CudosContract(contractInfo.label)
    cudosContract.#codeId = contractInfo.codeId
    cudosContract.#contractAddress = contractInfo.address
    cudosContract.#creator = contractInfo.creator
    return cudosContract
  }

  // Uploads the contract's code to the network
  async uploadCode(options = { signer: null }) {
    if (this.#isUploaded()) {
      throw new BlastError('Cannot upload contract that is already uploaded')
    }
    options.signer = options.signer ?? await getDefaultLocalSigner(getNetwork(process.env.BLAST_NETWORK))
    const uploadTx = await this.#uploadContract(options.signer)
    this.#codeId = uploadTx.codeId
    this.#creator = options.signer
    return uploadTx
  }

  // Instantiates uploaded code without assigning the new contract to current contract object instance
  async instantiate(msg, options = {
    signer: null, label: null, funds: null
  }) {
    if (!this.#isUploaded()) {
      throw new BlastError('Cannot instantiate contract that is not uploaded. ' +
        'Contract\'s code must exist on the network before instantiating')
    }
    options.signer = options.signer ?? await getDefaultLocalSigner(getNetwork(process.env.BLAST_NETWORK))
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
    options.signer = options.signer ?? await getDefaultLocalSigner(getNetwork(process.env.BLAST_NETWORK))
    options.label = options.label ?? this.#label
    const uploadTx = await this.#uploadContract(options.signer)
    this.#codeId = uploadTx.codeId
    this.#creator = options.signer
    const instantiateTx = await this.#instantiateContract(
      options.signer, uploadTx.codeId, msg, options.label, options.funds)
    this.#label = options.label
    this.#contractAddress = instantiateTx.contractAddress
    return {
      uploadTx: uploadTx,
      initTx: instantiateTx
    }
  }

  async execute(msg, signer = null) {
    if (!this.#isDeployed()) {
      throw new BlastError('Cannot use "execute()" on non-deployed contracts')
    }
    signer = signer ?? await getDefaultLocalSigner(getNetwork(process.env.BLAST_NETWORK))
    const fee = calculateFee(1_500_000, this.#gasPrice)
    return signer.execute(signer.address, this.#contractAddress, msg, fee)
  }

  async query(msg, signer = null) {
    if (!this.#isDeployed()) {
      throw new BlastError('Cannot use "query()" on non-deployed contracts')
    }
    signer = signer ?? await getDefaultLocalSigner(getNetwork(process.env.BLAST_NETWORK))
    return await signer.queryContractSmart(this.#contractAddress, msg)
  }

  getAddress() {
    if (!this.#isDeployed()) {
      return null
    }
    return this.#contractAddress
  }

  getCodeId() {
    if (!this.#isUploaded()) {
      return null
    }
    return this.#codeId
  }

  getLabel() {
    return this.#label
  }

  getCreator() {
    if (!this.#isUploaded()) {
      return null
    }
    return this.#creator
  }

  async #uploadContract(signer) {
    // TODO: pass gasLimit as a param or read it from config
    const wasm = fs.readFileSync(this.#wasmPath)
    const uploadFee = calculateFee(1_500_000, this.#gasPrice)
    return signer.upload(
      signer.address,
      wasm,
      uploadFee
    )
  }

  async #instantiateContract(signer, codeId, msg, label, funds) {
    const instantiateFee = calculateFee(500_000, this.#gasPrice)
    return signer.instantiate(
      signer.address,
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
