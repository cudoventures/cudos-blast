# CUDOS BLAST

CUDOS BLAST is a Node.js CLI (command line interface) tool for working with the CUDOS blockchain. You can scaffold, compile, test (both unit & integration) your smart contracts.
Utilizing `blast.config.js` it provides a possibility for deploying and interacting with them on a specified network (local, test or public).
By using this tool you can also spin up a local [`CUDOS node`](https://github.com/CudoVentures/cudos-node) and interact with it.

## Table of Contents


| Command                                               | Description                                                                                                                            |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| [`blast init`](#blast-init)                           | Initialize a sample project                                                   |
| [`blast compile`](#blast-compile)                             | Compile all smart contracts in the project in alphabetical order                                                                           |
| [`blast unittest`](#blast-unittest)             | Run unit tests for the smart contracts   |
| [`blast test`](#blast-test)                        | Run integration tests for the smart contracts                                                                                                    |
| [`blast node`](#blast-node)                  | Base command for interaction with a local node. Subcommands: 'start', 'stop', 'status'.                                                                                               |
| [`blast run`](#blast-run)                        |  Run a custom javascript file - for deployment or interaction                                                                                                 |
| [`blast keys`](#blast-keys)                 | Base command for keystore/accounts management. Subcommands: 'ls', 'add', 'fund', 'rm'.                                                                              |

## Installation

Make sure you have [NodeJS](https://nodejs.org/en/download/package-manager/) installed. Using latest version is recommended. [Docker](https://docs.docker.com/engine/install) is also required.

> For Windows users we recommend using Windows Subsystem for Linux ([WSL](https://docs.microsoft.com/en-us/windows/wsl/install-manual#downloading-distros)).
> To avoid permission issues with `WSL`, you may have to [change](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally#manually-change-npms-default-directory) `npm` default directory. 

Clone the repository and navigate to its directory. Then install dependencies:

```bash
npm install
```

Install CUDOS BLAST (??? the name) globally:

```bash
npm install -g
```

---
## Help and version

Run `--help` on any `blast` command to show all available subcommands, parameters and additional information.

```bash
blast --help
```

Run `--version` on any `blast` command to show `cudos-blast` version number.

```bash
blast --version
```

---
## Initializing a project

To scaffold a sample project, navigate to empty directory and run

```bash
blast init
```

You can also specify the directory of the project using optional parameter `--dir` or `-d`

```bash
blast init --dir /Your/Location/Here
```

The project is now ready to work with the CUDOS blockchain. It contains sample smart contracts and scripts to deploy or interact.  
> Make sure to initialize a new project in a directory other than the local repository folder, or else `cudos-blast` will break and the repository have to be cloned again.  
> Also, all `blast` commands are designed to be executed from the project root directory.

---
## Compiling smart contracts

To compile all smart contracts, run

```bash
blast compile
```

The contracts have to be in `{project_root}/contracts` folder. They are compiled in alphabetical order. The smart contracts are compiled as a Rust workspace. If you want to add more folders to compile, all you have to do is edit the base `{project_root}/Cargo.toml` file and add your folder under `members`. The compilation is done using [rust-optimizer](https://github.com/CosmWasm/rust-optimizer) and the artifacts in `{project_root}/artifacts` folder are optimized for deployment.

---
## Running unit tests

To run smart contracts' unit tests:

```bash
blast unittest
```

To run unit tests without printing cargo log messages, use `--quiet` or `-q`

```bash
blast unittest -q
```

---
## Running integration tests

To run integration tests:

```bash
blast test
```

Integration tests have to be in the `{project_root}/integration_tests` folder.  
> Integration tests functionality is not working correctly. Only for demo purpose!

---
## Interacting with a CUDOS node

You can interact with a local [`CUDOS node`](https://github.com/CudoVentures/cudos-node) with `blast node` command.

### Starting a local node

To start a fresh local CUDOS node, run

```bash
blast node start
```

or you can leave the current terminal window free by running the local node in background. To do this, use `--daemon` or `(-d)`.

```bash
blast node start -d
```

### Stopping a running local node

To stop a running node, run

```bash
blast node stop
```

### Checking node status

To check whether a CUDOS node is online or offline, run

```bash
blast node status
```

You can check the status of a non-local CUDOS node by setting its URL in `blast.config.js` under `endpoint:`.

---
## Deploying smart contracts, interacting with them and running custom script files

You can use supplied `{project_root}/scripts/deploy.js` to deploy smart contracts one by one. You can interact with them by using supplied `interact.js` as a template. You are free to use custom `.js` scripts.

```bash
blast run scripts/deploy.js
blast run scripts/interact.js
blast run scripts/myCustomScript.js
```

You can specify your own script file path. A custom network can be set with `--network` or `(-n)`. Also, signer account can be specified with `--account` or `(-a)`. Default values can be changed in `blast.config.js` under `network` or `defaultAccount`. 

```bash
blast run newFolder/anotherScripts/myCustomScript.js
blast run scripts/deploy.js -a account2
blast run scripts/deploy.js -n cudos -a account2
```

---
## Managing local node accounts

You can manage accounts in a local CUDOS node with `blast keys` command.

### Listing all accounts

To list all accounts in the local node key storage, run

```bash
blast keys ls
```

### Adding new account

To add a new account named `myAccount1` to the local node key storage, run
  
```bash
blast keys add myAccount1
```

After adding the new account, it is automatically funded with `acudos` tokens from the default local node faucet.

### Removing existing account

To remove an account from the node key storage, run

```bash
blast keys rm myAccount1
```

You can skip the delete confirmation with `--force` or `-f`

```bash
blast keys rm myAccount1 -f
```

---
### Funding existing account

You can fund an account with additional tokens. To specify tokens amount, use `--tokens` or `-t`.

```bash
blast keys fund myAccount1 --tokens 1000000
```

The tokens are funded from the default local node faucet in `acudos`.

---
## Development

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
source ./packages/blast-tests/integration-tests/vars.sh

# echo prints out the strings that are passed to it
# -n flag tells your terminal to stay on the same line after printing out the message
echo -n 'blast init...'

# ARRANGE
# mkdir creates a folder at the path specified in INIT_FOLDER variable
# cd moves to the specified directory
# && lets you execute the command that follows the && only if the first command is successful
mkdir $INIT_FOLDER && cd $INIT_FOLDER

# ACT
# &> /dev/null hides the output of the command
blast init &> /dev/null

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
