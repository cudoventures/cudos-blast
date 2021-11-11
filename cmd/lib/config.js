const fsExstra = require('fs-extra');
const process = require('process');
const path = require('path');
const VError = require('verror');

let config = {};


async function getConfig(configPath) {
    if (await fsExstra.pathExists(configPath)) {
        config = require(configPath);
        return config;
    }
    throw new Error(`Config file was not found! Make sure that cudos.config.js exists at ${configPath}`)
}

async function getEndpoint(config) {
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


