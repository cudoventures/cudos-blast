const {
    SigningCosmWasmClient
} = require('@cosmjs/cosmwasm-stargate');

const {
    DirectSecp256k1Wallet
} = require('@cosmjs/proto-signing');
const {
    GasPrice,
} = require('@cosmjs/stargate');

const FindFiles = require('file-regex');

const {
    calculateFee
} = require('./index.js');

const path = require('path');
const fs = require('fs');

const {
    getConfig
} = require('./config');

const Contract = class {
    constructor(contractname, initMsg, label) {
        this.contractname = contractname;
        this.initMsg = initMsg;
        this.label = label || contractname;
    }

    async init() {
        let artifacts = path.join(process.cwd(), `contracts/${this.contractname}/artifacts`);
        let r = await FindFiles(artifacts, /\.wasm$/);
        if (r.length < 1) {
            console.log('Use [compile] command to compile all the contracts in the project.');
            process.exit(1);
        }

        this.wasmPath = path.join(artifacts, r[0].file);

        let {
            config
        } = await getConfig();
        this.config = config;

        // check config file

        if (!config.hasOwnProperty('gasPrice')) {
            console.log('Missing [gasPrice] field in the config file.');
            process.exit(1);
        }
        this.gasPrice = GasPrice.fromString(config.gasPrice);

        if (!config.hasOwnProperty('account')) {
            console.log('Missing [account] in the config file.');
            process.exit(1);
        }

        let privKey = Buffer.from(config.account.privKey, 'hex');
        let wallet = await DirectSecp256k1Wallet.fromKey(privKey, 'cudos');


        if (!config.hasOwnProperty('endpoint')) {
            console.log('Missing [endpoint] in the config file.');
            process.exit(1);
        }
        this.client = await SigningCosmWasmClient.connectWithSigner(config.endpoint, wallet);

        return this;
    }


    async deploy() {
        const uploadReceipt = await this.uploadContract();
        console.log(uploadReceipt)
        return await this.initContract(uploadReceipt.codeId);
    }

    async uploadContract() {
        const uploadFee = calculateFee(1_500_000, this.gasPrice);

        const wasm = fs.readFileSync(this.wasmPath);

        return await this.client.upload(
            this.config.account.address0,
            wasm,
            uploadFee,
        );
    }

    async initContract(codeId) {
        const instantiateFee = calculateFee(500_000, this.gasPrice);
        return {
            contractAddress
        } = await this.client.instantiate(
            this.config.account.address0,
            codeId,
            this.initMsg,
            this.label,
            instantiateFee,
        );
    }
}

async function getContractFactory(contractname, initMsg) {
    let contract = new Contract(contractname, initMsg)
    await contract.init();
    return contract;
}

module.exports.getContractFactory = getContractFactory;
