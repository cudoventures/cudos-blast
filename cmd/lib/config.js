const fsExstra = require('fs-extra');
const process = require('process');
const path = require('path');

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
        throw new Error('Missing [endpoint] in the config file.');
    }

    return config.endpoint;
}

module.exports = {
    getConfig: getConfig,
    getEndpoint: getEndpoint
}


