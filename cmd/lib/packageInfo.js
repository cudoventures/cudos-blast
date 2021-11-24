const path = require('path');
const findup = require('find-up');

function getDockerComposeInitFile() {
    return path.join(getPackageRoot(), 'docker-compose-init.yaml');
}

function getDockerComposeStartFile() {
    return path.join(getPackageRoot(), 'docker-compose-start.yaml');
}

function getPackageJsonPath() {
    return findClosestPackageJson(__filename);
}

function getProjectRootPath() {
    let pj = findClosestPackageJson('.');
    return path.dirname(pj);
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


module.exports = {
    findClosestPackageJson: findClosestPackageJson,
    getPackageJsonPath: getPackageJsonPath,
    getPackageRoot: getPackageRoot,
    getProjectRootPath: getProjectRootPath,
    getDockerComposeInitFile: getDockerComposeInitFile,
    getDockerComposeStartFile: getDockerComposeStartFile
};
