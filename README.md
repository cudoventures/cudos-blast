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
> A `Docker` installation is also required.

#### Mac and Linux

1. Install `npm` and `node`.
2. Clone the repo & and cd to the cloned directory
3. Install `cudos-cli` globally by running both: 

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
cudos node status
```

---

### `cudos run`
> Runs a custom javascript file. 
> Currently in the /scripts directory there are two files: deploy.js and interact.js
> In the future it should be possible to supply relevant info by the command line (smart contract name, user adress, etc) as option
> 

- arguments: `scriptFilePath` `string` `The script file to execute`
- options: `none`
  

  ###### How to deploy different smart contracts?
  > For each smart contract create a separate deploy file ( for example deploy_alpha.js and deploy_beta.js) and run it one by one. Do not forget to edit the contract name in the .js file ( line 4 in the supplied deploy.js file)

**Example:**

```bash
cudos run scripts/deploy.js
cudos run scripts/interact.js
cudos run scripts/yourScriptFile.js
```

---

### `cudos keys`
> Manages accounts/keys in local node

### Subcommands:

#### `cudos keys add accountName`
> Add account to the node key storage
- arguments: `accountName` `string`
- options: `none`
  
  
**Example:**

```bash
cudos keys add accountName
```

#### `cudos keys rm accountName`
> Removes account from the node key storage
- arguments: `accountName` `string`
- options: `--yes, -y` `No confirmation when deleting a user`

**Example:**

```bash
cudos keys rm accountName
```

#### `cudos keys ls`
> List all accounts in the node key storage
- arguments: `None`
- options: `None`
  
  
**Example:**

```bash
cudos keys ls
```

#### `cudos keys fund accountName`
> Fund account with tokens
- arguments: `accountName` `string` 
- options: `--tokens, -t` `string` `The amount of tokens to give` `required`
  
  
**Example:**

```bash
cudos keys fund accountName --token=10000000acudos

```

---
## Options

| Option                     | Description                                                                                                                            |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `--help`                   |  Show help  [boolean]                                                                                                                  |
| `--version`                |  Show version number  [boolean]                                                                                                        |                                                                    |
