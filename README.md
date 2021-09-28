# cudo-framework

```
cudo <cmd> [args]

Commands:
  cudo init                  create sample project
  cudo compile               Compiles in alphabetical order the smart contracts
                             in the workspace
  cudo node                  manage cudo local node
  cudo run [scriptFilePath]  run script
  cudo test                  run integration tests
  cudo unittest              runs the unit tests of the smart contracts
  cudo keys                  Manage keystore/accounts

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

## install
```
npm install -g
```
Build Docker image
```
# necessary step before we make production ready public cudos repo
docker build -t cudos/node -f cudos-node.Dockerfile .
```

## usage
### create sample project

```
mkdir [project-dir]
cd [project-dir]
cudo init
```

### create account (keypair)
```
cudo keys add alice
```

### fund account
```
cudo keys fund alice -t 1000000000ucudos
```
```
cudo keys ls
[
  {
    name: 'alice',
    addr: 'cudos1n4mxz8qu8zestvkk790ans2klj4qyzutcl550q',
    balance: { denom: 'ucudos', amount: '1000000000' }
  },
  {
    name: 'juliette',
    addr: 'cudos1nd8ppd846rhnuulujv7ay0vrppa5md705tvp8d',
    balance: { denom: 'ucudos', amount: '100043434300' }
  }
]
```
### compile
```
cudo compile
```

### starting and stopping cudos-node
```
cudo node start
```
```
cudo node stop
```
