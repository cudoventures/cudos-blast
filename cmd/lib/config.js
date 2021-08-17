const fsExstra = require('fs-extra');
const process = require('process');
const path = require('path');

let config = {};

const configPath = path.join(process.cwd(), 'cudos.config.js');

async function getConfig() {
    if (await fsExstra.pathExists(configPath)) {
        config = require(configPath);
    } else {
        console.log('init config');
        process.exit(1);
    }

    return config;
}

module.exports.getConfig = getConfig;
