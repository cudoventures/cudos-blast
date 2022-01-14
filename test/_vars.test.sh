export INIT_FOLDER='./test-cudos-init'
export CONTAINER_NAME='cudos-config_cudos-node'
export COMPOSE='docker compose -f ./packages/cudos-config/docker-compose-start.yaml -f ./packages/cudos-config/docker-compose-init.yaml exec cudos-node'
export UNITTEST_RESULT='test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out'
export COMPILE_FILES='alpha.wasm
beta.wasm
checksums.txt
checksums_intermediate.txt'
export TEST_RESULT="run tests
run test:  alpha.test.js"
export TEMPLATE_FILES='Cargo.lock
Cargo.toml
contracts
cudos.config.js
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
interaction.js'
