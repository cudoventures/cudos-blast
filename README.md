# CUDOS BLAST

CUDOS BLAST is a Node.js CLI (command line interface) tool for working with the CUDOS blockchain. You can scaffold, compile, test (both unit & integration) your smart contracts.
Utilizing `blast.config.js` it provides a possibility for deploying and interacting with them on a specified network (local, test or public).
By using this tool you can also spin up a local [`cudos node`](https://github.com/CudoVentures/cudos-node) and interact with it.

## Overview

_Click on a command for more information and examples._


| Command                                               | Description                                                                                                                            |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| [`blast init`](#blast-init)                           | Initialize a sample project                                                   |
| [`blast compile`](#blast-compile)                             | Compile all smart contracts in the project in alphabetical order                                                                           |
| [`blast unittest`](#blast-unittest)             | Run unit tests for the smart contracts   |
| [`blast test`](#blast-test)                        | Run integration tests for the smart contracts                                                                                                    |
| [`blast node`](#blast-node)                  | Base command for interaction with a local node. Subcommands: 'start', 'stop', 'status'.                                                                                               |
| [`blast run`](#blast-run)                        |  Run a custom javascript file - for deployment or interaction                                                                                                 |
| [`blast keys`](#blast-keys)                 | Base command for keystore/accounts management. Subcommands: 'ls', 'add', 'fund', 'rm'.                                                                              |

### Installation

> Make sure you have a current version of `npm` and `NodeJS` installed.  
> A `Docker` installation is also required.

#### Mac and Linux

1. Install `npm` and `node`.
2. Clone the repo & and cd to the cloned directory
3. Install `cudos-blast` globally by running both: 

```bash
npm install
```
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
6. Run both:

```bash
npm install
```
```bash
npm install -g
```

---

### Running tests

```bash
# Run all tests
npm run test
```
```bash
# Run specific test
npm run test -- init.test.sh
```

---

### Writing integration tests

```bash
# it is recommended to execute npm run test before reading this to get a general idea of the behavior

# lets take a look at init.test.sh
# the command should initialize a project inside the current directory
# the test follows the classic Arrange-Act-Assert pattern

# our files start with #!/bin/bash, which tells your terminal it should use bash to execute the file
#!/bin/bash

# source lets you use the content of a file
# ex. INIT_FOLDER, TEMPLATE_FILES
source ./packages/cudos-tests/integration-tests/vars.sh

# echo prints out the strings that are passed to it
# -n flag tells your terminal to stay on the same line after printing out the message
echo -n 'cudos init...'

# ARRANGE
# mkdir creates a folder at the path specified in INIT_FOLDER variable
# cd moves to the specified directory
# && lets you execute the command that follows the && only if the first command is successful
mkdir $INIT_FOLDER && cd $INIT_FOLDER

# ACT
# &> /dev/null hides the output of the command
cudos init &> /dev/null

# ASSERT
# ls -R lists directory content.
# `` executes the command placed inside and provides its output
# we compare the output with the expected folder structure defined in TEMPLATE_FILES
if [[ ! `ls -R` == $TEMPLATE_FILES ]]; then
    # if the output doesn't match we print out a fail message
    # FAILED variable defines a red colored message
    # -e flag escapes special characters, we need it in order to have colored messages
    # 1>&2 redirects the output to stderr
    echo -e "$FAILED\nGenerated folder is invalid!" 1>&2

    # we define a variable with status 1
    # in bash status code 1 means the script was not successful
    exit_status=1
else
    # otherwise we print pass message
    echo -e $PASSED
fi

# we cleanup the files generated by the test
# rm -r removes the specified directory
rm -r ../$INIT_FOLDER &> /dev/null

# we exit the script
# if the test fails and exit_status is assigned on line40 the program will exit with status 1
# otherwise the exit_status will be undefined and the program will exit without a status, which means it was successful
exit $exit_status
```

---

### Network selection

todo

---

## Full commands info

### `blast init`

> Scaffolds a sample project that is ready to work with the CUDOS blockchain. Contains sample smart contracts and scripts to deploy or interact. Optionally you can specify the directory of the project. If not specified - project is created in the current working directory.

- arguments: `none`
- options: `--dir (-d)` `string, optional` `Specify a path to install`

**Example:**

```bash
blast init
```

```bash
blast init --d /Your/Location/Here
```

---

### `blast compile`

> Compiles all smart contracts in alphabetical order. 
> Please note that you have to call `blast compile` from the root of your project and the contracts have to be in a folder `{project_root}/contracts` or else the tool will not find them. 
> The contracts are compiled as a Rust workspace and therefore if you want to add more folders to compile (i.e. dependent packages in a separate /packages folder) all you have to do is edit the base `{project_root}/Cargo.toml` file and add your folder under ```[members]```. 
> The compilation is done using [rust-optimizer](https://github.com/CosmWasm/rust-optimizer) and the artifacts in `{project_root}/artifacts` folder are optimized for deployment.

- arguments: `none`
- options: `--optimizer (-o)` `string, optional` `Specify the cargo optimizer version`

**Example:**

```bash
blast compile
```

---

### `blast unittest`

> Runs the unit tests of the smart contracts. 
> The command have to be called from the project root (or the main Cargo.toml file directory).

- arguments: `none`
- options: `none`

**Example:**

```bash
blast unittest
```

---

### `blast test`

`It is not working correctly. Only for demo purpose!`
> Runs the integration tests of the smart contracts - by default located in the `integration_test` folder. 
> The command have to be called from the project root directory.

- arguments: `none`
- options: `none`

**Example:**

```bash
blast test
```

---


### `blast node`

> Base command for interaction with a local node ([`cudos node`](https://github.com/CudoVentures/cudos-node)). 
> Run ```blast node --help``` for more information.

### `blast node start`
> Starts a local CUDOS node

- arguments: `none`
- options: `--daemon (-d)` `optional` `Run the node as a daemon and leaves the current console window free and usable`

**Example:**

```bash
blast node start
blast node start -d
```

### `blast node stop`
> Stops a local CUDOS node

**Example:**

```bash
blast node stop
```

### `blast node status`
> Gives a status of a local CUDOS node - online/offline

**Example:**

```bash
blast node status
```

---

### `blast run`
> Runs a custom javascript file. 
> Currently in the /scripts directory there are two files: `deploy.js` and `interact.js`. 
> In the future it should be possible to supply relevant info by the command line (smart contract name, user adress, etc) as option 

- arguments: `scriptFilePath` `string` `The script file to be executed`
- options: `--network (-n)` `string, optional` `Specify a custom network`  
&emsp;`--account (-a)` `string, optional` `Specified account name becomes signer`  
  

  ###### How to deploy different smart contracts?
  > For each smart contract create a separate deploy file (e.g. deploy_alpha.js and deploy_beta.js) and run it one by one. Do not forget to edit the contract name in the .js file (line 4 in the supplied deploy.js file)

**Example:**

```bash
blast run scripts/deploy.js
blast run scripts/interact.js
blast run scripts/yourScriptFile.js
```

---

### `blast keys`
> Manages accounts/keys in local node. 
> Run ```blast keys --help``` for more information.

### Subcommands:

#### `blast keys add`
> Add an account to the node key storage
- arguments: `accountName` `string, required`
- options: `none`
  
  
**Example:**

```bash
blast keys add myAccount1
```

#### `blast keys rm`
> Removes an account from the node key storage
- arguments: `accountName` `string, required`
- options: `--force, -f` `Delete without confirmation`

**Example:**

```bash
blast keys rm myAccount1
```

#### `blast keys ls`
> List all accounts in the node key storage
- arguments: `None`
- options: `None`
  
  
**Example:**

```bash
blast keys ls
```

#### `blast keys fund`
> Fund account with tokens
- arguments: `accountName` `string, required` `The account to be supplied with tokens`
- options: `--tokens (-t)` `string, required` `The amount of tokens in acudos. They are transferred from the default local node faucet`
  
  
**Example:**

```bash
blast keys fund myAccount1 --tokens 1000000
```

---
## Options

| Option                     | Description                                                                                                                            |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `--help`                   |  Show help  [boolean]                                                                                                                  |
| `--version`                |  Show version number  [boolean]                                                                                                        |                                                                    |
