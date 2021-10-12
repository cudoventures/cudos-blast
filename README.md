# CUDOS CLI (command line interface)

CUDOS CLI is a Node.js framework for working with the CUDOS blockchain. Using it you can scaffold, compile, test (both unit & integration) your smart contracts.
Utilizing [`cudos.js`](https://github.com/CudoVentures/cudos.js) it offers the possibility to deploy and interact with them on a specified network ( local, test or public).
By using this tool you can also spin up a local [`cudos node`](https://github.com/CudoVentures/cudos-node) and interact with it.

## Overview

_Click on a command for more information and examples._


| Command                                               | Description                                                                                                                            |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| [`cudos init`](#cudos-init)                           | Initializes a sample project                                                   |
| [`cudos compile`](#cudos-compile)                             | Compiles all the smart contracts in the project in alphabetical order                                                                           |
| [`cudos unittest`](#cudos-unittest)             | Runs the unit tests for the smart contracts   |
| [`cudos test`](#cudos-test)                        | Runs the integration tests for the smart contracts                                                                                                    |
| [`cudos node`](#cudos-node)                  | Base command for interacting with a local node. Subcommands: 'start', 'stop', 'status', 'keys'.                                                                                               |
| [`cudos run`](#cudos-run)                        |  Runs a custom javascript file - for deployment and interaction                                                                                                 |
| [`cudos keys`](#cudos-keys)                 | Base comand for maneging keystore/accounts. Subcommands: 'add', 'rm', 'fund', 'ls'.                                                                              |

### Installation

> Make sure you have a current version of `npm` and `NodeJS` installed.

#### Mac and Linux

1. Install `npm` and `node`.
2. Clone the repo & and cd to the cloned directory
3. Install `cudos-cli` globally by running: 
```bash
npm install -g
```

#### Windows

> For Windows users, we recommend using Windows Subsystem for Linux (`WSL`).

1. Install `WSL` [[click here]](https://docs.microsoft.com/en-us/windows/wsl/install-manual#downloading-distros)
2. Install `npm` [[click here]](https://www.npmjs.com/get-npm)
3. Install ` Node.js` [ [ click here ]](https://nodejs.org/en/download/package-manager/)
4. Change `npm` default directory [ [ click here ] ](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally#manually-change-npms-default-directory)
   - This is to avoid any permission issues with `WSL`
5. Open `WSL`, clone the repo and cd to its directory
6. Run:

```bash
npm install -g
```

---

### Build Docker image

 -  necessary step before we make production ready public cudos repo
```docker build -t cudos/node -f cudos-node.Dockerfile .```

### Network selection

todo

---

## Full commands info

### `cudos init`

> Scaffolds a sample project that is ready to work with the CUDOS blockchain. Contains smart contracts and scripts to deploy and interact with them. Optionally you specify the directory of the project. If not specified - gets created in the current working directory.

- arguments: `none`
- options: `-dir (--d)` `string` `Specify a path to install` `not required`

**Example:**

```bash
cudos init
```

```bash
cudos init --d /Your/Location/Here
```

---

### `cudos compile`

> Compiles all the smart contracts in alphabetical order. 
> Please note that you have to call `cudo compile` from the root of your project and the contracts have to be in a folder named '/contracts' again in the root of the project or else the tool will not find them.
> The contracts are compiled as Rust workspace - this means that if you want to add more folders for compile (ie dependent packages in a separate /packages folder ) all you have to do is go in the base Cargo.toml file ( located at project root) and add your folder under ```[members]```
> The compilation is done using [rust-optimizer](https://github.com/CosmWasm/rust-optimizer) and the artefacts (projectRoot/artefacts folder) are optimized for deployment.

- arguments: `none`
- options: `none`

**Example:**

```bash
cudos compile
```

---

### `cudos unittest`

> Runs the unit tests of the smart contracts. 
> In order for the command to find the tests - please call it from the root of your project or wherever you main Cargo.toml file is located.

- arguments: `none`
- options: `none`

**Example:**

```bash
cudos unittest
```

---

### `cudos test`

`Currently its not working correctly, only for demo purpose !`
> Runs the integration tests of the smart contracts - by default located in the `integration_test` folder
> In order for the command to find the tests - please call it from the root of your project.

- arguments: `none`
- options: `none`

**Example:**

```bash
cudos test
```

---


### `cudos node`

> Base command for interaction with a local node ([`cudos node`](https://github.com/CudoVentures/cudos-node) )
> Run ```cudo node --help``` for info

### `cudos node start`
> Starts a local CUDOS node

- arguments: `none`
- options: `--daemon` `--d` `runs the node as a daemon and leaves the current console window free and usable` `not required`

**Example:**

```bash
cudos node start
cudos node start --d
```

### `cudos node stop`
> Stops a local CUDOS node

**Example:**

```bash
cudos node stop
```

### `cudos node status`
> Gives a status of a local CUDOS node - online/offline

**Example:**

```bash
cudos node stop
```

### `cudos node keys`
> List keys of a local CUDOS node

**Example:**

```bash
cudos node keys
```

---

### `cudos run`
> Runs a custom javascript file. 
> Currently in the /scripts directory there are two files: deploy.js and interact.js
> In the future it should be possibly to supply relevant info by the command line (smart contract name, user adress, etc) as option
> 

- arguments: `scriptFilePath` `string` `The script file to execute`
- options: `none`
  

  ###### How to deploy different smart contracts?
  > For each of your smart contracts create a separate deploy file ( for example deploy_alpha.js and deploy_beta.js) and run it one by one. Do not forget to edit the contract name in the .js file ( line 4 in the supplied deploy.js file)

**Example:**

```bash
cudos run scripts/deploy.js
cudos run scripts/interact.js
cudos run scripts/yourScriptFile.js
```

---

### `cudos keys`
> Manages keystore/accounts

### Subcommands:

#### `cudos keys add accountName`
> Add account to the keystore
- arguments: `accountName` `string`
- options: `none`
  
  
**Example:**

```bash
cudos keys add accountName
```

#### `cudos keys rm accountName`
> Removes account from keystore
- arguments: `accountName` `string`
- options: `--yes, -y` `No confirmation when deleting a user`

**Example:**

```bash
cudos keys rm accountName
```

#### `cudos keys ls`
> List all accounts in the keystore
- arguments: `None`
- options: `None`
  
  
**Example:**

```bash
cudos keys ls
```

#### `cudos keys fund accountName`
> Fund account with tokens
- arguments: `accountName` `string` 
- options: 
  - `--address, -a` `string` `The address of the account` `not required if accountName is supplied - only if we want to fund account which is not in the keystore`
  - `--tokens, -t` `string` `The amount of tokens to give` `required`
  
  
**Example:**

```bash
cudos keys fund accountName --token=10000000ucudos
cudos keys fund --address=yourCosmosAddress --token=10000000ucudos

```

---
## Options

| Option                     | Description                                                                                                                            |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `--help`                   |  Show help  [boolean]                                                                                                                  |
| `--version`                |  Show version number  [boolean]                                                                                                        |                                                                    |
