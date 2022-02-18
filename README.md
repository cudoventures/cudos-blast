# Cudos Blast

Cudos Blast is a Node.js CLI (command line interface) tool for working with the Cudos blockchain. You can scaffold, compile and test your **Rust** smart contracts. Both unit and integration testing is supported.
Utilizing `blast.config.js` it provides a possibility for deploying and interacting with them on a specified network (local, test or public).
By using this tool you can also spin up a local [`Cudos node`](https://github.com/CudoVentures/cudos-node) and interact with it.

## Table of Contents

* [Installation](#installation) 
* [Help and version](#help-and-version) 
* [Initializing a project](#initializing-a-project) 
* [Compiling smart contracts](#compiling-smart-contracts) 
* [Running unit tests](#running-unit-tests) 
* [Running integration tests](#running-integration-tests) 
* [Interacting with a Cudos node](#interacting-with-a-Cudos-node) 
  * [Starting a local node](#starting-a-local-node) 
  * [Stopping a running local node](#stopping-a-running-local-node) 
  * [Checking node status](#checking-node-status) 
* [Deploying smart contracts, interacting with them and running custom script files](#deploying-smart-contracts,-interacting-with-them-and-running-custom-script-files) 
  * [Available functions in global context](#available-functions-in-global-context)
* [Network](#network)
  * [Testnet](#testnet)
  * [Mainnet](#mainnet)
* [Managing local node accounts](#managing-local-node-accounts) 
  * [Listing all accounts](#listing-all-accounts) 
  * [Adding new account](#adding-new-account) 
  * [Removing existing account](#removing-existing-account) 
  * [Funding existing account](#funding-existing-account) 
* [Development](#development) 
  * [Running tests](#running-tests) 
  * [Sample integration test](#sample-integration-test) 

## Installation

Make sure you have [Node.js](https://nodejs.org/en/download/package-manager/) installed.  [Docker](https://docs.docker.com/engine/install) is also required.

| Prerequisite   | Minimum version | Recommended version |
| ---            | ---             | ---                 |
| Node.js        | 12.5.0          | 16.10.0             |
| npm            | 6.9.0           | 7.24.0              |
| Docker engine  | 19.03.13        | 20.10.12            |
| Docker compose | 1.27.4          | 1.29.2              |  

> For Windows users we recommend using Windows Subsystem for Linux ([WSL](https://docs.microsoft.com/en-us/windows/wsl/install-manual#downloading-distros)).
> To avoid permission issues with `WSL`, you may have to [change](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally#manually-change-npms-default-directory) `npm` default directory. 

Clone the repository and navigate to its directory. Then install dependencies:

```bash
npm install
```

Install Cudos Blast globally:

```bash
npm install -g
```

---
## Help and version

Run `--help` or `help` on any `blast` command to show all available subcommands, parameters and additional information. 

```bash
blast --help
blast help
blast node --help
blast node start help
```

You can display `cudos-blast` version number using `--version`.

```bash
blast --version
```

---

## Initializing a project

To scaffold a sample project navigate to empty directory and run

```bash
blast init
```

You can also specify the full directory of the project using optional parameter `--dir` or `-d`

```bash
blast init --dir /Your/Location/Here
```

The project is now ready to work with the Cudos blockchain. It contains sample smart contracts and scripts to deploy or interact.  
> Make sure to initialize a new project in a directory other than the local repository folder, or else `cudos-blast` will break and the repository have to be cloned again.  
> Also, all `blast` commands are designed to be executed from the project root directory.

---
## Compiling smart contracts

To compile all smart contracts run

```bash
blast compile
```

The contracts have to be in `{project_root}/contracts/` folder. They are compiled in alphabetical order. The smart contracts are compiled as a Rust workspace. If you want to add more folders to compile, all you have to do is edit the base `{project_root}/Cargo.toml` file and add your folder under `members`. The compilation is done using [rust-optimizer](https://github.com/CosmWasm/rust-optimizer) and the artifacts in `{project_root}/artifacts/` folder are optimized for deployment.

---
## Running unit tests

The unit tests are written in Rust and are organized by the Rust convention for writing tests. You can check them in the respective contract in `{project_root}/contracts/{contract_name}/`. To run smart contracts' unit tests:

```bash
blast unittest
```

To run unit tests without printing cargo log messages use `--quiet` or `-q`

```bash
blast unittest -q
```

---
## Running integration tests

The integration tests have to be JavaScript files located in `{project_root}/integration_tests/` folder. Run them with

```bash
blast test
```

---
## Interacting with a Cudos node

You can interact with a local [`Cudos node`](https://github.com/CudoVentures/cudos-node) with `blast node` command.

### Starting a local node

To start a fresh local Cudos node run

```bash
blast node start
```

or you can leave the current terminal window free by running the local node in background. To do this use `--daemon` or `-d`.

```bash
blast node start -d
```

To see how to manage local node accounts go [here](#managing-local-node-accounts).

### Stopping a running local node

To stop a running node run

```bash
blast node stop
```

### Checking node status

To check whether a Cudos node is online or offline run

```bash
blast node status
```

You are able to check the status of a [non-local Cudos node](#network) by setting its URL in `blast.config.js` under `networkUrl:`.

---
## Deploying smart contracts, interacting with them and running custom script files

You can use the supplied `{project_root}/scripts/deploy.js` to deploy a sample smart contract.

```bash
async function main () {
  // functions such as 'getSigners' and 'getContractFactory' are available in global context
  const [alice, bob] = await getSigners()

  // get contract object of 'alpha' contract in 'contracts/alpha'
  const contract = await getContractFactory('alpha')

  // define instantiate message for the contract
  const MSG_INIT = { count: 13 }

  // deploying the contract with bob as a signer
  const contractAddress = await contract.deploy(MSG_INIT, bob)

  // printing contract address so it can be copied and used in other scripts such as interact.js
  console.log(`${contractAddress}`)
}
// ...
```

Run the contract with:

```bash
blast run scripts/deploy.js
```

When the contract is deployed, its address will be printed. Then you can edit `{project_root}/scripts/interact.js` with the new address

```bash
async function main() {
  const [alice, bob] = await getSigners()

  // replace the address with the new one from your deployed smart contract
  const contract = await getContractFromAddress('cudos1uul3yzm2lgskp3dxpj0zg558hppxk6pt8t00qe')
// ...
```

and run the script to interact with the deployed smart contract.

```bash
blast run scripts/interact.js
```

You are free to use these files as templates or create your own custom `.js` scripts. You can specify your own script file path. 

```bash
blast run scripts/myCustomScript.js
blast run newFolder/anotherScripts/myCustomScript.js
```

### Available functions in global context

| Function                                              | Descripton                                                                                                       | Code example                                                                                  |
| ---                                                   | ---                                                                                                              | ---                                                                                           |
| getSigners()                                          | set supplied accounts? as signers in order as in `{project_root}/accounts.json`                                  | const [alice, bob] = await getSigners()                                                       |
| getContractFactory(contractName)                      | get a contract object from contract named `contractName` and sign it witn the first account                      | const contract = await getContractFactory('alpha')                                            |
| getContractFromAddress(contractAddress, owner = null) | get a contract object by its address. Contract owner can be omitted if present in `{project_root}/accounts.json` | const contract = await getContractFromAddress('cudos1uul3yzm2lgskp3dxpj0zg558hppxk6pt8t00qe') |

You can run your scripts on a different node by setting its URL in `blast.config.js` under `networkUrl`. You can connect to the default local node as well as a [public one](#network) or you can use your own Cudos node.  
You can set a custom address prefix under `addressPrefix` in `blast.config.js`. Default is `cudos`.

---
## Network

Here are public Cudos nodes you can use to connect to Cudos network:

### Testnet

| Chain ID               | URL                                            |
| ---                    | ---                                            |
| cudos-testnet-public-2 | https://sentry1.gcp-uscentral1.cudos.org:26657 |

### Mainnet

| Chain ID | URL |
| ---      | --- |
|          |     |

---
## Managing local node accounts

By default local Cudos node starts with 10 predefined accounts funded with `acudos`. You can set how many additional random accounts to load when starting a local node in `blast.config.js` under `additionalAccounts`. In `customAccountBalances` you can set the amount of tokens that these additional accounts will be funded with. Predefined and additionally generated accounts are written in `{project_root}/accounts.json`. Another way to manage custom accounts is through `blast keys` command.

### Listing all accounts

To list all accounts in the local node key storage run

```bash
blast keys ls
```

### Adding new account

To add a new account named `myAccount1` to the local node key storage run
  
```bash
blast keys add myAccount1
```

After adding the new account, it is automatically funded with `acudos` tokens from the default local node faucet.

### Removing existing account

To remove an account from the node key storage run

```bash
blast keys rm myAccount1
```

You can skip the delete confirmation with `--force` or `-f`

```bash
blast keys rm myAccount1 -f
```

---
### Funding existing account

You can fund an account with additional tokens. To specify tokens amount use `--tokens` or `-t`.

```bash
blast keys fund myAccount1 --tokens 1000000
```

The tokens are funded from the default local node faucet in `acudos`.

---
##  Development



### Running tests

You can run tests that ensure `blast` commands are working correctly.

```bash
npm test
```

You can also specify the test file name to run a single test. Test files are located in `{repo_root}/packages/blast-tests/integration-tests/tests/`

```bash
npm test init.test.sh
```

---
### Sample integration test

The following sample test contains a detailed explanation of the commands and syntax. It is recommended to execute `npm test` first to get a general idea of the behavior. New tests should be placed in `{repo_root}/packages/blast-tests/integration-tests/tests/` folder. Lets take a look at `init.test.sh`. It covers `blast init` command which should initialize a project inside the current directory. The tests follow the classic Arrange-Act-Assert pattern.

```bash
# our files start with "#!/bin/bash", which tells your terminal it should use bash to execute the file
#!/bin/bash

# "source" lets you use the contents of a file
source ./packages/blast-tests/integration-tests/vars.sh

# 'echo' prints out the string
# -n flag tells your terminal to stay on the same line after printing out the message
echo -n 'blast init...'

# ARRANGE
# "mkdir" creates a folder at the path specified in INIT_FOLDER variable
# "cd" navigates to the specified directory
# "&&" lets you execute the command that follows it only if the first command is successful
mkdir $INIT_FOLDER && cd $INIT_FOLDER

# ACT
# "&>" hides the output of the command
blast init &> /dev/null

# ASSERT
# "ls -R" lists directory content
# `` executes the command placed inside and provides its output
# we compare the output with the expected folder structure defined in TEMPLATE_FILES
if [[ ! `ls` == $TEMPLATE_FILES || ! `ls scripts` == $TEMPLATE_SCRIPTS_FILES ]]; then

    # if the output doesn't match we print a fail message
    # FAILED variable defines a red colored message
    # -e flag escapes special characters, we need it in order to have colored messages
    # 1>&2 redirects the output to stderr
    echo -e "$FAILED\nGenerated folder is invalid!" 1>&2

    # we are defining a variable with status 1
    # in bash status code 1 means the script was not successful
    exit_status=1
else
    # otherwise we print pass message
    echo -e $PASSED
fi

# we are cleaning up the files generated by the test
# "rm -r" removes the specified directory
rm -r ../$INIT_FOLDER &> /dev/null

# EXIT the script
# if the test fails and exit_status is assigned, the program will exit with status 1
# otherwise the exit_status will be undefined and the program will exit without a status, which means it was successful
exit $exit_status
```
