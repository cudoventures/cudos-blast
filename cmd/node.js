const {
    execCmd,
    execSyncCmd
} = require("./lib");

const path = require('path');

const docker = require('./lib/docker');
const {
    getPrivKey
} = require('./lib/node');

const dockerComposeFile = path.join(__dirname, '..', 'cudos-node.yaml');
const cudosNodeHomeDir = './cudos_data/node';

const startNode = async function(argv) {
    execSyncCmd(`docker-compose -f ${dockerComposeFile} up -d`);
};

const stopNode = function(argv) {
    execSyncCmd(`docker-compose -f ${dockerComposeFile} down`);
};


const statusNode = function(argv) {
    let nStatus = execSyncCmd(`docker-compose -f ${dockerComposeFile} exec -T cudos-node cudos-noded --home ${cudosNodeHomeDir} status`);
    console.log(nStatus.toString());
};

const keysNode = async function(argv) {
    const keys = execSyncCmd(`docker-compose -f ${dockerComposeFile} exec -T cudos-node cudos-noded --home ${cudosNodeHomeDir} keys list  --output json`);
    console.log(JSON.parse(keys));

};

const _getPrivKey = async function(argv) {
    const privKey = getPrivKey(argv.user);
    console.log(String(privKey));
}

exports.command = 'node';
exports.describe = 'manage cudo local node';

exports.builder = (yargs) => {
    yargs.command('start', 'start node', (yargs) => {}, startNode)
        .command('stop', 'stopping node', (yargs) => {}, stopNode)
        .command('status', 'check node status', (yargs) => {}, statusNode)
        .command('keys', 'list keys', (yargs) => {}, keysNode)
        .command('getpriv [user]', 'get privkey', (yargs) => {
            yargs.positional('user', {
                type: 'string',
                describe: 'account name',
            })
        }, _getPrivKey);
};

exports.handler = function(argv) {}
