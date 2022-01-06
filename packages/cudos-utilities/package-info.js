const path = require('path')
const findup = require('find-up')

const PATH_TO_DOCKER_CONFIG = 'packages/cudos-config/'

function getDockerComposeInitFile() {
  return path.join(getPackageRoot(), PATH_TO_DOCKER_CONFIG, 'docker-compose-init.yaml')
}

function getDockerComposeStartFile() {
  return path.join(getPackageRoot(), PATH_TO_DOCKER_CONFIG, 'docker-compose-start.yaml')
}

function getPackageJsonPath() {
  return findClosestPackageJson(__filename)
}

function getProjectRootPath() {
  const pj = findClosestPackageJson('.')
  return path.dirname(pj)
}

function getPackageRoot() {
  const packageJsonPath = getPackageJsonPath()

  return path.dirname(packageJsonPath)
}

function findClosestPackageJson(file) {
  return findup.sync('package.json', {
    cwd: path.dirname(file)
  })
}

module.exports = {
  getPackageRoot: getPackageRoot,
  getProjectRootPath: getProjectRootPath,
  getDockerComposeInitFile: getDockerComposeInitFile,
  getDockerComposeStartFile: getDockerComposeStartFile
}
