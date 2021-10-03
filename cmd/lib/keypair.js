import bip39 from 'bip39'
import bip32 from 'bip32'
import secp256k1 from 'secp256k1'
import { bech32 } from 'bech32'
import createHash from 'create-hash'

function createFromMnemonic (mnenonic, hdPath) {
  if (!mnenonic) {
    mnenonic = bip39.generateMnemonic(256)
    const privateKey = seedToPrivateKey(mnenonic, hdPath)
    return {
      mnemonic: mnenonic,
      privateKey: privateKey
    }
  } else {
    const privateKey = seedToPrivateKey(mnenonic, hdPath)
    return {
      mnenonic: mnenonic,
      privateKey: privateKey
    }
  }
}

export function getAddressFromPrivateKey (privateKey, network = 'cudos') {
  const publicKeyArr = secp256k1.publicKeyCreate(privateKey, true)
  const publicKey = Buffer.from(publicKeyArr)
  const sha256 = createHash('sha256')
  const ripemd = createHash('ripemd160')
  sha256.update(publicKey)
  ripemd.update(sha256.digest())
  const rawAddr = ripemd.digest()
  return bech32.encode(network, bech32.toWords(rawAddr))
}

function seedToPrivateKey (mnemonic, hdPath = 'm/44\'/118\'/0\'/0/0') {
  const seed = bip39.mnemonicToSeedSync(mnemonic)
  const masterKey = bip32.fromSeed(seed)
  const { privateKey } = masterKey.derivePath(hdPath)
  return privateKey
}

export function createKeyPair (mnemonic, hdPath = 'm/44\'/118\'/0\'/0/0') {
  return createFromMnemonic(mnemonic, hdPath)
}
