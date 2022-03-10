const path = require('path')
const findup = require('find-up')

const PATH_TO_DOCKER_CONFIG = 'packages/blast-config/'

function getDockerComposeInitFile() {
  return path.join(getPackageRootPath(), PATH_TO_DOCKER_CONFIG, 'docker-compose-init.yaml')
}

function getDockerComposeStartFile() {
  return path.join(getPackageRootPath(), PATH_TO_DOCKER_CONFIG, 'docker-compose-start.yaml')
}

function getPackageRootPath() {
  const packageJsonPath = findClosestPackageJson(__filename)
  return path.dirname(packageJsonPath)
}

function getProjectRootPath() {
  const packageJsonPath = findClosestPackageJson('.')
  return path.dirname(packageJsonPath)
}

function findClosestPackageJson(file) {
  return findup.sync('package.json', { cwd: path.dirname(file) })
}

module.exports = {
  getPackageRootPath: getPackageRootPath,
  getProjectRootPath: getProjectRootPath,
  getDockerComposeInitFile: getDockerComposeInitFile,
  getDockerComposeStartFile: getDockerComposeStartFile
}
