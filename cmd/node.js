const {
    stopNode,
    startNode,
    keysNode
} = require("./lib/commandService");

const {
    isAvailable
} = require("./lib/status")

const startNodeCmd = async function(argv) {
    startNode(argv.daemon);
};

const stopNodeCmd = function() {
    stopNode();
};

const statusNodeCmd = async function() {
    if (await isAvailable()) {
        console.log("Node is online!");
    } else {
        console.log("Node is offline!");
    }
};

const keysNodeCmd = async function() {
    try {
        keysNode();
    } catch {
        console.log("Could not fetch keys, is your node online? Execute 'cudo node status' for more info")
    }
};

exports.command = 'node';
exports.describe = 'manage cudo local node';

exports.builder = (yargs) => {
    yargs.command('start', 'start node', () => {
            yargs.option('daemon', {
                alias: 'd',
                type: 'boolean',
                default: false,
                description: 'Run Node in the background',
            })
        }, startNodeCmd)
        .command('stop', 'stopping node', () => {}, stopNodeCmd)
        .command('status', 'check node status', () => {}, statusNodeCmd)
        .command('keys', 'list keys', () => {}, keysNodeCmd)
        .demandCommand(1, "No command specified!") // user must specify atleast one command
};
