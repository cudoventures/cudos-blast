const os = require('os')
const path = require('path')
const VError = require('verror')
const {
  Buffer
} = require('buffer')
const {
  DirectSecp256k1Wallet
} = require('cudosjs')
const fsExtra = require('fs-extra')
const keypair = require('./keypair')

const FAUCET_MNEMONIC = 'excite identify move harvest grocery flat tank appear multiply early whisper bronze morning giggle pony genius normal priority truly assume false creek pulse twenty'

const KeyStore = class {
  constructor () {
    this.network = 'cudos'
    this.keyStoreDir = path.join(os.homedir(), '.cudos-cli', 'keystore')
    fsExtra.ensureDirSync(this.keyStoreDir)
  }

  async initFaucetAccount () {
    const accountPath = path.join(this.keyStoreDir, 'faucet')
    if (!await fsExtra.pathExists(accountPath)) {
      await this.createNewAccount('faucet', FAUCET_MNEMONIC)
    }
  }

  async getAccountPath (name) {
    const accountPath = path.join(this.keyStoreDir, name)
    if (!await fsExtra.pathExists(accountPath)) {
      throw new VError(`Account ${name} does not exist.`)
    }
    return accountPath
  }

  async createNewAccount (name, mnemonic) {
    const kp = keypair.Create(mnemonic)
    await this.saveAccount(name, {
      privateKey: kp.privateKey
    })
    return {
      mnemonic: kp.mnemonic,
      address: keypair.getAddressFromPrivateKey(kp.privateKey)
    }
  }

  async saveAccount (name, account) {
    const accountPath = path.join(this.keyStoreDir, name)
    if (await fsExtra.pathExists(accountPath)) {
      throw new VError('Account already exists in the keyStore.')
    }
    await fsExtra.writeJson(accountPath, account)
    return account
  }

  async loadAccount (name) {
    const accountPath = await this.getAccountPath(name)
    const acc = await fsExtra.readJson(accountPath)
    acc.privateKey = Buffer.from(acc.privateKey)
    return acc
  }

  async getAccountAddress (name) {
    const account = await this.loadAccount(name)
    return await keypair.getAddressFromPrivateKey(account.privateKey)
  }

  async getSigner (name) {
    const acc = await this.loadAccount(name)
    return await DirectSecp256k1Wallet.fromKey(acc.privateKey, this.network)
  }
}

const ks = new KeyStore()
const p = ks.initFaucetAccount()
p.then()

module.exports = {
  keystore: ks
}
