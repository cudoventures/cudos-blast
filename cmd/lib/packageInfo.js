const path = require('path');
const findup = require('find-up');


function getPackageJsonPath() {
    return findClosestPackageJson(__filename);
}

function getPackageRoot() {
    const packageJsonPath = getPackageJsonPath();

    return path.dirname(packageJsonPath);
}

function findClosestPackageJson(file) {
    return findup.sync("package.json", {
        cwd: path.dirname(file)
    });
}

function dockerComposeFile() {
    return findup.sync("cudos-node.yaml", {
        cwd: getPackageRoot()
    });
}

module.exports = {
    findClosestPackageJson: findClosestPackageJson,
    getPackageJsonPath: getPackageJsonPath,
    getPackageRoot: getPackageRoot,
    dockerComposeFile: dockerComposeFile
}