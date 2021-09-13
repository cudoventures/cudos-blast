const fsExtra = require('fs-extra');
const path = require('path');
const fs = require("fs");


const {
    getPackageRoot
} = require('./lib/packageInfo');

async function initCmd(argv) {

    let directoryToCopyTo = argv.dir;
    if (!checkIfDirectoryIsValidAndWritable(directoryToCopyTo)) {
        console.error(`Directory ${directoryToCopyTo} is not valid!`);
        return;
    }

    // check for project 

    await fsExtra.copy(
        path.join(getPackageRoot(), "template"),
        directoryToCopyTo != '.' ? directoryToCopyTo : '.'
    )
}

function checkIfDirectoryIsValidAndWritable(directoryToCheck) {
    try {
        fs.accessSync(directoryToCheck);
        return true;
    } catch (error) {
        return false;
    }
}

module.exports.initCmd = initCmd;
