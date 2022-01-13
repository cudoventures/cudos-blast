echo cudos init TEST

mkdir test-cudos-init
cd test-cudos-init
cudos init

EXPECTED="Cargo.lock
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
interaction.js"
RESULT=$(ls -R)
if [[ ! "$RESULT" == $EXPECTED ]]; then
    echo cudos init FAILED
    exit 1
fi
echo cudos init SUCCESS