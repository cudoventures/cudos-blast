const fsExstra = require('fs-extra');
const process = require('process');
const path = require('path');
const VError = require('verror');

let config = {};

const configPath = path.join(process.cwd(), 'cudos.config.js');

async function checkConfig() {
    const config = await getConfig();
}

async function getConfig() {
    if (await fsExstra.pathExists(configPath)) {
        config = require(configPath);
    } else {
        console.log(`Config file was not found! Make sure that cudos.config.js exists at ${configPath}`);
        process.exit(1);
    }

    return config;
}

async function getEndpoint() {
    let {
        config
    } = await getConfig();

    if (!config.hasOwnProperty('endpoint')) {
        throw new VError('Missing [endpoint] in the config file.');
    }

    return config.endpoint;
}

async function getGasPrice() {
    let {
        config
    } = await getConfig();

    if (!config.hasOwnProperty('gasPrice')) {
        throw new VError('Missing gasPrice in the config file.');
    }

    return config.gasPrice;
}

module.exports = {
    getConfig: getConfig,
    getEndpoint: getEndpoint,
    getGasPrice: getGasPrice
}
