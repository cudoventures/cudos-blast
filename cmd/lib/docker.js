const {
    spawnSync
} = require("child_process");

const {
    getDockerComposeFile,
    getDockerEnvFile
} = require('./packageInfo');

const cudosNodeHomeDir = './cudos_data/node';

const dockerComposeCmd = `docker-compose --env-file=${getDockerEnvFile()} -f ${getDockerComposeFile()} `;

const nodeCmd = `exec -T cudos-node cudos-noded --home ${cudosNodeHomeDir} `;
const starportCmd = `exec -T cudos-node starport --home ${cudosNodeHomeDir} `;

const doDocker = function(cmd) {
    spawnSync(cmd, {
        stdio: 'inherit',
        shell: true
    });
}

const execute = function(arg) {
    let cmd = dockerComposeCmd + arg
    doDocker(cmd);
}

const executeNode = function(arg) {
    execute(nodeCmd + arg);
}

const executeStarport = function(arg) {
    execute(starportCmd + arg);
}

const stopNode = function() {
    execute('down');
}

const startNode = function(inBackground) {
    if (inBackground) {
        execute('up -d');
    } else {
        execute('up');
    }
}

const statusNode = function() {
    executeNode('status');
}

const keysNode = function() {
    executeNode('keys list  --output json');
}

const fundAccount = function(address, tokens) {
    executeStarport(`chain faucet ${address} ${tokens}`);
}

module.exports = {
    stopNode: stopNode,
    startNode: startNode,
    statusNode: statusNode,
    keysNode: keysNode,
    fundAccount: fundAccount
}