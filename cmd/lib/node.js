const {
    execSyncCmd
} = require("./index.js");

const {
    dockerComposeFile
} = require('./packageInfo');

const cudosNodeHomeDir = './cudos_data/node';

function getPrivKey(user) {
    const privKey = execSyncCmd(`yes y | docker-compose -f ${dockerComposeFile()} exec -T cudos-node cudos-noded --home ${cudosNodeHomeDir} keys export --unsafe --unarmored-hex ${user}`);
    return String(privKey);
}

module.exports = {
    getPrivKey: getPrivKey
}