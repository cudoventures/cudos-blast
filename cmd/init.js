const fs = require('fs');
const {
    execSync
} = require("child_process");

function initCmd(argv) {
    if (fs.existsSync(argv.contractname)) {
        console.log(`${argv.contractname} exists`);
        return
    }

    execSync(`cp -r template ${argv.contractname}`);
    console.log('Done.');
}

module.exports.initCmd = initCmd;
