# cudo-framework

```
cudo <cmd> [args]

Commands:
  cudo init                    create sample project
  cudo compile [contractname]  compile smart contract
  cudo node                    manage cudo local node
  cudo run [scriptfile]        run script

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
