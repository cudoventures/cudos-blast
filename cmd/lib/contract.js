const {
    SigningCosmWasmClient
} = require('@cosmjs/cosmwasm-stargate');

const {
    DirectSecp256k1Wallet
} = require('@cosmjs/proto-signing');
const {
    GasPrice,
} = require('@cosmjs/stargate');

const {
    calculateFee
} = require('./index.js');

const path = require('path');
const fs = require('fs');

const {
    getConfig
} = require('./config');

const {
    keystore
} = require('./keystore');

const configPath = path.join(process.cwd(), 'cudos.config.js');

async function getContractSigner(contractAddress) {
    const client = await getClient();
    return await client.getContract(contractAddress);
}

async function getClient() {
    let {
        config
    } = await getConfig(configPath);
    let wallet;

    if (!config.hasOwnProperty('account')) {
        console.log('Missing [account] in the config file.');
        process.exit(1);
    }

    if (!config.account.hasOwnProperty('name')) {
        console.log('Provide account name in the cudos.config.js file.');
        process.exit(1);
    }

    let name = config.account.name;
    wallet = await keystore.getSigner(name);

    if (!config.hasOwnProperty('endpoint')) {
        console.log('Missing [endpoint] in the config file.');
        process.exit(1);
    }
    // return client
    return await SigningCosmWasmClient.connectWithSigner(config.endpoint, wallet);
}

const Contract = class {
    constructor(contractname, initMsg, label) {
        this.contractname = contractname;
        this.initMsg = initMsg;
        this.label = label || contractname;
    }

    async init() {
        if (!this.deployed) {
            this.wasmPath = '';
            try {
                this.wasmPath = path.join(process.cwd(), `artifacts/${this.contractname}.wasm`);
            }
            catch (ex) {
                console.error(`Contract with name ${this.contractname} was not found, did you compile it ? \n run cudo --help for more available commands`)
            }
        }

        let {
            config
        } = await getConfig(configPath);
        this.config = config;

        // check config file

        if (!config.hasOwnProperty('gasPrice')) {
            console.log('Missing [gasPrice] field in the config file.');
            process.exit(1);
        }
        this.gasPrice = GasPrice.fromString(config.gasPrice);

        try {
            this.client = await getClient();
            this.config.account.address0 = await keystore.getAccountAddress(config.account.name);
        }
        catch (ex) {
            console.error(ex.message)
        }


        return this;
    }


    async deploy() {
        const uploadReceipt = await this.uploadContract();
        console.log(uploadReceipt)
        const ic = await this.initContract(uploadReceipt.codeId);
        console.log(ic);
        this.contractAddress = ic.contractAddress;
        return ic.contractAddress;
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
        return await this.client.instantiate(
            this.config.account.address0,
            codeId,
            this.initMsg,
            this.label,
            instantiateFee,
        );
    }

    addAddress(contractAddress) {
        this.deployed = true;
        this.contractAddress = contractAddress
    }

    async execute(msg) {
        const fee = calculateFee(1_500_000, this.gasPrice);
        return await this.client.execute(this.config.account.address0, this.contractAddress, msg, fee);
    }

    async querySmart(queryMsg) {
        return await this.client.queryContractSmart(this.contractAddress, queryMsg)
    }
}

async function getContractFactory(contractname, initMsg) {
    try {
        let contract = new Contract(contractname, initMsg)
        await contract.init();
    }
    catch (ex) {
        console.error(ex.message)
    }

    return contract;
}

async function getContractFromAddress(contractAddress) {
    try {
        let contract = new Contract();
        contract.addAddress(contractAddress);
        await contract.init();
    }
    catch (ex) {
        console.error(ex.message);
    }
    return contract;
}

module.exports = {
    getContractFactory: getContractFactory,
    getContractFromAddress: getContractFromAddress
};
