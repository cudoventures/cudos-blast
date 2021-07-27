const {
    SigningCosmWasmClient
} = require('@cosmjs/cosmwasm-stargate');
const {
    DirectSecp256k1HdWallet
} = require('@cosmjs/proto-signing');
const {
    calculateFee,
    GasPrice
} = require('@cosmjs/stargate');

const fs = require('fs');


const mnemonic = 'enlist hip relief stomach skate base shallow young switch frequent cry park';

// account
// path to wasm bytecode

async function deployCmd(argv) {
    const gasPrice = GasPrice.fromString("0.025ucudos");
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
        prefix: "cudos"
    })


    // Upload contract
    const wasm = fs.readFileSync(pathToWasnByteCode);
    const uploadFee = calculateFee(1 _500_000, gasPrice);
    const codeMeta = {
        source: "",
        builder: "",
    };
    const uploadReceipt = await client.upload(
        address,
        wasm,
        uploadFee,
        codeMeta,
        "Upload test contract",
    );

    console.log('deploy');
}

module.exports.deployCmd = deployCmd;
