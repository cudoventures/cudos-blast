const fsExstra = require('fs-extra');
const path = require('path');

const {
    getPackageRoot
} = require('./lib/packageInfo');

async function initCmd(argv) {

    // check for project	
    await fsExstra.copy(
        path.join(getPackageRoot(), "template"), '.'
    )
}

module.exports.initCmd = initCmd;
