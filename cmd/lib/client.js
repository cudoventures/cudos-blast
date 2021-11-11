const {
    SigningCosmWasmClient,
    calculateFee,
    GasPrice
} = require('cudosjs');

const {
    keystore
} = require('./keystore');

const {
    getEndpoint,
    getGasPrice
} = require('./config');


async function faucetSendTo(address, amount) {
    let client = await getClient('faucet');
    let faddr = await keystore.getAccountAddress('faucet');
    let gasPrice = await getGasPrice();
    let fee = calculateFee(80_000, GasPrice.fromString(gasPrice));
    let value = amount.match(/(\d+)/)[0];
    let denom = amount.split(value)[1];
    await client.sendTokens(faddr, address, [{
        amount: value,
        denom: denom
    }], fee);
}

async function getClient(name) {
    let endpoint = await getEndpoint();
    let wallet = await keystore.getSigner(name);
    return await SigningCosmWasmClient.connectWithSigner(endpoint, wallet);
}

module.exports = {
    faucetSendTo: faucetSendTo
}
