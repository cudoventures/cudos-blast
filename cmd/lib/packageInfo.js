import path from 'path'
import findup from 'find-up'

export function getDockerComposeFile () {
  return path.join(getPackageRoot(), 'docker-compose.yaml')
}

export function getDockerEnvFile () {
  return path.join(getPackageRoot(), '.docker_env')
}

export function getPackageJsonPath () {
  return findClosestPackageJson(__filename)
}

export function getProjectRootPath () {
  const pj = findClosestPackageJson('.')
  return path.dirname(pj)
}

export function getPackageRoot () {
  const packageJsonPath = getPackageJsonPath()

  return path.dirname(packageJsonPath)
}

export function findClosestPackageJson (file) {
  return findup.sync('package.json', { cwd: path.dirname(file) })
}
