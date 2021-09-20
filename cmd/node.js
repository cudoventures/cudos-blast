const {
    execSyncCmd
} = require("./lib");

const path = require('path');

const {
    getPrivKey
} = require('./lib/node');

const dockerComposeFile = path.join(__dirname, '..', 'cudos-node.yaml');
const cudosNodeHomeDir = './cudos_data/node';

const startNode = async function () {
    execSyncCmd(`docker-compose -f ${dockerComposeFile} up -d`, { stdio: 'inherit' });
};

const stopNode = function () {
    execSyncCmd(`docker-compose -f ${dockerComposeFile} down`, { stdio: 'inherit' });
};

const statusNode = function () {
    let nStatus = execSyncCmd(`docker-compose -f ${dockerComposeFile} exec -T cudos-node cudos-noded --home ${cudosNodeHomeDir} status`, { stdio: 'inherit' });
    console.log(nStatus.toString());
};

const keysNode = async function () {
    const keys = execSyncCmd(`docker-compose -f ${dockerComposeFile} exec -T cudos-node cudos-noded --home ${cudosNodeHomeDir} keys list  --output json`, { stdio: 'inherit' });
    console.log(JSON.parse(keys));

};

const _getPrivKey = async function (argv) {
    const privKey = getPrivKey(argv.user);
    console.log(String(privKey));
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
