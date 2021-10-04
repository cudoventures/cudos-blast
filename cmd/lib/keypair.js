const bip39 = require('bip39');
const bip32 = require('bip32');
const secp256k1 = require('secp256k1');
const {
    bech32
} = require('bech32');
const createHash = require('create-hash');

function createFromMnemonic(mnemonic, hdPath) {
    if (!mnemonic) {
        const mnemonic = bip39.generateMnemonic(256);
        const privateKey = seedToPrivateKey(mnemonic, hdPath);
        return {
            mnemonic: mnemonic,
            privateKey: privateKey
        };
    } else {
        const privateKey = seedToPrivateKey(mnemonic, hdPath);
        return {
            mnemonic: mnemonic,
            privateKey: privateKey
        };
    }
}

function getAddressFromPrivateKey(privateKey, network = 'cudos') {
    const publicKeyArr = secp256k1.publicKeyCreate(privateKey, true);
    const publicKey = Buffer.from(publicKeyArr);
    const sha256 = createHash('sha256');
    const ripemd = createHash('ripemd160')
    sha256.update(publicKey);
    ripemd.update(sha256.digest());
    const rawAddr = ripemd.digest();
    return bech32.encode(network, bech32.toWords(rawAddr));
}

function seedToPrivateKey(mnemonic, hdPath = `m/44'/118'/0'/0/0`) {
    const seed = bip39.mnemonicToSeedSync(mnemonic)
    const masterKey = bip32.fromSeed(seed)
    const {
        privateKey
    } = masterKey.derivePath(hdPath)
    return privateKey;
}

function createKeyPair(mnemonic, hdPath = `m/44'/118'/0'/0/0`) {
    return createFromMnemonic(mnemonic, hdPath);
}

module.exports = {
    Create: createKeyPair,
    getAddressFromPrivateKey: getAddressFromPrivateKey
}