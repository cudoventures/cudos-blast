#!/bin/bash

export TESTS_FOLDER='./packages/blast-tests/integration-tests/tests'
export INIT_FOLDER='./test-blast-init'
export CONTAINER_NAME='blast-config_cudos-node'
export COMPOSE='docker compose -f ./packages/blast-config/docker-compose-start.yaml -f ./packages/blast-config/docker-compose-init.yaml exec cudos-node'
red='\033[0;31m'
green='\033[0;32m'
reset_color='\033[m'
export PASSED="${green}PASSED${reset_color}"
export FAILED="${red}FAILED${reset_color}"
export EXPECTED="${green}EXPECTED:${reset_color}"
export ACTUAL="${red}ACTUAL:${reset_color}"
export VALID_BLOCK_STATUS='"height":'
export TEST_KEY='testtest'
export KEY_REMOVED_MSG='Key deleted forever'
export BALANCE_AFTER_FUND='amount: "1"'
export UNITTEST_RESULT='test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out'
export TEST_RESULT="Running integration tests...
run test:  alpha.test.js"
export COMPILE_FILES='alpha.wasm
beta.wasm
checksums.txt
checksums_intermediate.txt'
export TEMPLATE_FILES='Cargo.lock
Cargo.toml
blast.config.js
contracts
integration_tests
package.json
scripts

./contracts:
alpha
beta

./contracts/alpha:
Cargo.toml
examples
rustfmt.toml
schema
src

./contracts/alpha/examples:
schema.rs

./contracts/alpha/schema:
count_response.json
execute_msg.json
instantiate_msg.json
query_msg.json
state.json

./contracts/alpha/src:
contract.rs
error.rs
lib.rs
msg.rs
state.rs

./contracts/beta:
Cargo.lock
Cargo.toml
examples
rustfmt.toml
schema
src

./contracts/beta/examples:
schema.rs

./contracts/beta/schema:
count_response.json
execute_msg.json
instantiate_msg.json
query_msg.json
state.json

./contracts/beta/src:
contract.rs
error.rs
lib.rs
msg.rs
state.rs

./integration_tests:
alpha.test.js

./scripts:
deploy.js
interact.js'
