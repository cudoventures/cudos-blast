const {
    docker
} = require("./lib");

const startNode = async function() {
    docker.startNode();
};

const stopNode = function() {
    docker.stopNode();
};

const statusNode = function() {
    try {
        docker.statusNode();
        console.log("Node is online!");
    } catch (ex) {
        console.log("Node is offline!");
    }
};

const keysNode = async function() {
    try {
        docker.keysNode();
    } catch {
        console.log("Could not fetch keys, is your node online? Execute 'cudo node status' for more info")
    }
};

exports.command = 'node';
exports.describe = 'manage cudo local node';

exports.builder = (yargs) => {
    yargs.command('start', 'start node', () => {}, startNode)
        .command('stop', 'stopping node', () => {}, stopNode)
        .command('status', 'check node status', () => {}, statusNode)
        .command('keys', 'list keys', () => {}, keysNode)
};
