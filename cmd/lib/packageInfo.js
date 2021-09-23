const path = require('path');
const findup = require('find-up');


function getDockerComposeFile() {
    return path.join(getPackageRoot(), 'docker-compose.yaml');
}

function getDockerEnvFile() {
    return path.join(getPackageRoot(), '.docker_env');
}

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


module.exports = {
    findClosestPackageJson: findClosestPackageJson,
    getPackageJsonPath: getPackageJsonPath,
    getPackageRoot: getPackageRoot,
    getDockerComposeFile: getDockerComposeFile,
    getDockerEnvFile: getDockerEnvFile
}