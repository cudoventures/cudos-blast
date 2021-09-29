const fsExstra = require('fs-extra');
const process = require('process');
const path = require('path');

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

module.exports.getConfig = getConfig;