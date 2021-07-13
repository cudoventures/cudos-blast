# cudo-framework

```cudo <cmd> [args]

Commands:
  cudo init [contractname]     init smart contract template
  cudo compile [contractname]  compile smart contract

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
git clone [cudos-node repo]
docker build -t cudos/node -f cudos-node.Dockerfile .
```

## usage
### create smart contract project
```
cudo init contractname
```

### compile
```
cudo compile contractname
```

### setup wasmd node
```
cudo wasmd setup
```

### starting and stopping wasmd node
```
cudo wasmd start
```
```
cudo wasmd stop
```
