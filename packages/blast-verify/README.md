# blast-verify

Cudos Blast plugin for interaction with Cudos network's contract verification services.

## Table of Contents
* [Installation](#installation)
* [Environment extensions](#environment-extensions)
* [Tasks](#tasks)
* [Usage](#usage)
* [Plugin specifics](#plugin-specifics)

## Installation

```bash
npm install --save-dev @cudos/blast-verify
```

Then add the following statement to your `blast.config.js`:

```bash
require('@cudos/blast-verify')
```

## Environment extensions

This plugins adds a `verify` object to the Blast Runtime Environment. Through this object you can access the following:

```js
async function verify.verifyContract (localContractLabel, contractAddress): { verified: Boolean, parsed: Boolean, verificationError?: String, parsingError?: String }
```


## Tasks

This plugin provides the `verify` task:

```
blast verify

Verify a deployed smart contract's code matches a local one

Options:
  -a, --address              Deployed contract's address     [string] [required]
  -l, --label                Local smart contract's label    [string] [required]
      --list-networks, --ls  Prints all supported networks   [boolean] [default: false]
      --help                 Show help                       [boolean]
```

## Usage

You need to add the following to your `blast.config.js` file:

```js
require('@cudos/blast-verify')

module.exports.config = {
  // ...
  verifyNetwork: 'private_testnet'
}
```

You can see the supported verify services' names and URLs by running

```bash
blast verify --ls
```

To verify a contract you can either use `verify` object in the deployment scripts:

```js
const verify = require('@cudos/blast-verify')

async function main() {
  // ...
  const result = await verify.verifyContract('beta', 'cudos1j68t7ythea9fr9qt7ajf4nfc8hlw8p6420ll70')
  console.log(result)
}
```

or use the provided task:

```bash
blast verify --address=cudos1j68t7ythea9fr9qt7ajf4nfc8hlw8p6420ll70 --label=beta
```

## Plugin specifics

TODO: {
- The current plugin version is compatible with cudos-blast v2.?.? or later
- It is strongly advised to check and update the cudos-blast version before installing the verify plugin
}
- The contracts in your project must be able to be compiled and optimized as a workspace.
- The plugin compresses the contracts into a local archive in `{project_root}/temp` folder and deletes the folder when it is not needed.
- Only after a successful contract verification, the plugin will try to parse the contract schema.
