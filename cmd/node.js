const {
    execSyncCmd
} = require("./lib");

const path = require('path');

const dockerComposeFile = path.join(__dirname, '..', 'docker-compose.yaml');
const cudosNodeHomeDir = './cudos_data/node';

const startNode = async function () {
    execSyncCmd(`docker-compose --env-file=.docker_env -f ${dockerComposeFile} up`, { stdio: 'inherit' });
};

const stopNode = function () {
    execSyncCmd(`docker-compose --env-file=.docker_env -f ${dockerComposeFile} down`, { stdio: 'inherit' });
};

const statusNode = function () {
    try {
        execSyncCmd(`docker-compose --env-file=.docker_env -f ${dockerComposeFile} exec -T cudos-node cudos-noded --home ${cudosNodeHomeDir} status`, { stdio: 'inherit' });
        console.log("Node is online!");
    } catch (ex) {
        console.log("Node is offline!");
    }
};

const keysNode = async function () {
    try {
        execSyncCmd(`docker-compose --env-file=.docker_env -f ${dockerComposeFile} exec -T cudos-node cudos-noded --home ${cudosNodeHomeDir} keys list  --output json`, { stdio: 'inherit' });
    }
    catch {
        console.log("Could not fetch keys, is your node online? Execute 'cudo node status' for more info")
    }
};

const _getPrivKey = async function (argv) {
    try {
        execSyncCmd(`yes y | docker-compose -f ${dockerComposeFile} exec -T cudos-node cudos-noded --home ${cudosNodeHomeDir} keys export --unsafe --unarmored-hex ${argv.user}`, { stdio: 'inherit' });
    }
    catch (ex) {
        console.log("Could not export private key, is your node online? Execute 'cudo node status' for more info")
    }
}

exports.command = 'node';
exports.describe = 'manage cudo local node';

exports.builder = (yargs) => {
    yargs.command('start', 'start node', () => { }, startNode)
        .command('stop', 'stopping node', () => { }, stopNode)
        .command('status', 'check node status', () => { }, statusNode)
        .command('keys', 'list keys', () => { }, keysNode)
        .command('getpriv [user]', 'get privkey', () => {
            yargs.positional('user', {
                type: 'string',
                describe: 'account name',
            })
        }, _getPrivKey);
};
