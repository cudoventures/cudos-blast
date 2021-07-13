const {
    execCmd,
    execSyncCmd
} = require("./lib");

const path = require('path');

const dockerComposeFile = path.join(__dirname, '..', 'docker-wasmd.yaml');

const startNode = function(argv) {
    execSyncCmd(`docker-compose -f ${dockerComposeFile} up -d`);
};

const stopNode = function(argv) {
    execSyncCmd(`docker-compose -f ${dockerComposeFile} down`);
};


const setupNode = function(argv) {
    console.log('setup wasmd local node...');
    execSyncCmd(`docker volume rm -f wasmd_data`);
    execCmd(`docker run --rm -e PASSWORD=xxxxxxxxx --mount type=volume,source=wasmd_data,target=/root cosmwasm/wasmd:latest /opt/setup_wasmd.sh ${argv.address}`);
};

exports.command = 'wasmd';
exports.describe = 'manage local wasmd node';

exports.builder = (yargs) => {
    yargs.command('start', 'start wasmd node', (yargs) => {}, startNode)
        .command('stop', 'stopping wasmd node', (yargs) => {}, stopNode)
        .command('setup', 'setup wasmd local node', (yargs) => {
            yargs.option('address', {
                alias: 'a',
                type: 'string',
                default: 'cosmos1fjyt3rq37w0ndu6cr5psazm2kjjsq6e0kxkvck',
                description: 'cosmos address'
            })
        }, setupNode)
};

exports.handler = function(argv) {}