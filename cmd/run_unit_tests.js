const {
    execSyncCmd
} = require("./lib");
const path = require('path');


function runUnitTests() {
    try {
        let cmd = `docker run --rm --user "$(id -u)":"$(id -g)" -v "${path.resolve('.')}":/usr/src/cudos-cli -w /usr/src/cudos-cli rust:1.55-slim-buster  cargo test --lib`
        execSyncCmd(cmd, { stdio: 'inherit' });
    }
    catch (ex) {
        console.log(ex.message)
    }
}

async function unitTestCmd(argv) {
    console.log('Running contract unit tests...');
    runUnitTests();
}

module.exports.unitTestCmd = unitTestCmd;
