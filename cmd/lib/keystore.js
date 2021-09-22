const os = require('os');
const path = require('path');
const {
    Buffer
} = require('buffer');
const {
    DirectSecp256k1Wallet
} = require('@cosmjs/proto-signing');
const fsExtra = require('fs-extra');


const KeyStore = class {
    constructor() {
        this.network = 'cudos';
        this.keyStoreDir = path.join(os.homedir(), '.cudos-cli', 'keystore');
    }

    async init() {
        if (!fsExtra.pathExists(this.keyStoreDir)) {
            fsExtra.mkdirp(this.keyStoreDir)
        }
    }

    async saveAccount(name, account) {
        const accountPath = path.join(this.keyStoreDir, name)
        console.log(accountPath);
        if (await fsExtra.pathExists(accountPath)) {
            throw new Error('Account already exists in the keyStore.');
        }
        fsExtra.writeJson(accountPath, account);
        return account;
    }

    async loadAccount(name) {
        const accountPath = path.join(this.keyStoreDir, name)
        if (!await fsExtra.pathExists(accountPath)) {
            throw new Error(`Account ${name} does not exist.`);
        }
        let acc = await fsExtra.readJson(accountPath);
        acc.privateKey = Buffer.from(acc.privateKey);
        return acc;
    }

    async getSigner(name) {
        const acc = await this.loadAccount(name);
        return await DirectSecp256k1Wallet.fromKey(acc.privateKey, this.network);
    }

    async list() {
        const accounts = await fsExtra.readdir(this.keyStoreDir);
        return accounts;
    }
}

const ks = new KeyStore();
ks.init();

module.exports = {
    keystore: ks
}
