#!/bin/bash

export TESTS_FOLDER='./packages/blast-tests/e2e-tests/tests'
export INIT_FOLDER='./test-blast-init'
export DEFAULT_ACCOUNTS_FILE_PATH='./packages/blast-config/default-accounts.json'
export CONTAINER_NAME='cudos_blast_node'
export DOCKER_ERROR='Cannot connect to the Docker daemon'
export COMPOSE='docker compose -f ./packages/blast-config/docker-compose-start.yaml -f ./packages/blast-config/docker-compose-init.yaml exec -T cudos-node'
red='\033[0;31m'
green='\033[0;32m'
reset_color='\033[m'
export PASSED="${green}PASSED${reset_color}"
export FAILED="${red}FAILED${reset_color}"
export EXPECTED="${green}EXPECTED:${reset_color}"
export ACTUAL="${red}ACTUAL:${reset_color}"
export VALID_BLOCK_STATUS='"height":'
export TEST_KEY='testtest'
export ADDITIONAL_KEY='account11'
export KEY_REMOVED_MSG='Key deleted forever'
export BALANCE_AFTER_FUND='amount: "1"'
export CUSTOM_BALANCE='amount: "500"'
export RUSTTEST_RESULT='test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out'
export TEST_RESULT='3 passed, 3 total'
export COMPILE_FILES='alpha.wasm
beta.wasm
checksums.txt
checksums_intermediate.txt'
export TEMPLATE_FILES='Cargo.lock
Cargo.toml
blast.config.js
contracts
jsconfig.json
package.json
private-accounts.json
scripts
tests'
export TEMPLATE_SCRIPTS_FILES='deploy.js
interact.js'