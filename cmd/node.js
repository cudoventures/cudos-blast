const {
    execCmd,
    execSyncCmd
} = require("./lib");

const path = require('path');

const dockerComposeFile = path.join(__dirname, '..', 'cudos-node.yaml');
const cudosNodeHomeDir = './cudos_data/node';

const startNode = function(argv) {
    execSyncCmd(`docker-compose -f ${dockerComposeFile} up -d`);
};

const stopNode = function(argv) {
    execSyncCmd(`docker-compose -f ${dockerComposeFile} down`);
};


// TODO
const resetNode = function(argv) {
    execCmd(`docker-compose -f ${dockerComposeFile} run cudos-node serve --home ${cudosNodeHomeDir} -r`);
};

const statusNode = function(argv) {
    try {
        let nStatus = execSyncCmd(`docker-compose -f ${dockerComposeFile} exec -T cudos-node cudos-noded --home ${cudosNodeHomeDir} status`);
        console.log(nStatus.toString());
    } catch (e) {}
	console.log('Node is down.');
};

const keysNode = function(argv) {
    execCmd(`docker-compose -f ${dockerComposeFile} exec -T cudos-node cudos-noded --home ${cudosNodeHomeDir} keys list`);
};

exports.command = 'node';
exports.describe = 'manage cudo local node';

exports.builder = (yargs) => {
    yargs.command('start', 'start node', (yargs) => {}, startNode)
        .command('stop', 'stopping node', (yargs) => {}, stopNode)
        .command('status', 'chece node status', (yargs) => {}, statusNode)
        .command('keys', 'list keys', (yargs) => {}, keysNode)
};

exports.handler = function(argv) {}
