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

### compile
```
cudo compile contractname
```

### starting and stopping cudos-node
```
cudo node start
```
```
cudo node stop
```
