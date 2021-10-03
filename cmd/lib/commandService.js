import fs from 'fs'
import { spawnSync } from 'child_process'
import { getDockerComposeFile, getDockerEnvFile, getProjectRootPath } from './packageInfo'

const optimizerVer = '0.11.5'

const cudosNodeHomeDir = './cudos_data/node'

const dockerComposeCmd = `docker-compose --env-file=${getDockerEnvFile()} -f ${getDockerComposeFile()} `

const nodeCmd = `exec -T cudos-node cudos-noded --home ${cudosNodeHomeDir} `
const starportCmd = `exec -T cudos-node starport --home ${cudosNodeHomeDir} `

function doDocker(cmd) {
  spawnSync(cmd, { stdio: 'inherit', shell: true })
}

function execute(arg) {
  const cmd = dockerComposeCmd + arg
  doDocker(cmd)
}

function executeNode(arg) {
  execute(nodeCmd + arg)
}

function executeStarport(arg) {
  execute(starportCmd + arg)
}

export function stopNode() {
  execute('down')
}

export function startNode(inBackground) {
  let cmd = inBackground ? 'up -d' : 'up'
  execute(cmd)
}

export function statusNode() {
  executeNode('status')
}

export function keysNode() {
  executeNode('keys list  --output json')
}

export function fundAccount(address, tokens) {
  executeStarport(`chain faucet ${address} ${tokens}`)
}

export function compile() {
  const projectRootPath = getProjectRootPath()
  const compileCmd = `docker run --rm -v "${projectRootPath}":/code  --mount type=volume,source="contracts_cache",target=/code/target  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cosmwasm/workspace-optimizer:${optimizerVer}`

  console.log(`${projectRootPath}/contracts`)
  if (!fs.existsSync(`${projectRootPath}/contracts`)) {
    throw new Error('No contracts folder found! Make sure to place your smart contracts in /contracts.')
  }
  doDocker(compileCmd)
}
