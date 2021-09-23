const {
    execSyncCmd
} = require("./lib");

function runUnitTests() {

    try {
        execSyncCmd(`RUST_BACKTRACE=1 cargo test --lib`, { stdio: 'inherit' });
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


