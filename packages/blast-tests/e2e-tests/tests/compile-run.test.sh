#!/bin/bash
source ./packages/blast-tests/e2e-tests/vars.sh

init_folder="$INIT_FOLDER-compile"
cp -R template $init_folder &> /dev/null
cd $init_folder

echo -n 'blast compile...'

blast compile &> /dev/null
cd artifacts
if [[ `ls` == $COMPILE_FILES ]]; then
    echo -e $PASSED
else
    echo -e "$FAILED\nInvalid artifacts!" 1>&2
    exit_status=1
fi

echo -n 'blast run...'
cd ..
if [[ $exit_status == 1 ]]; then
    docker run --rm -v "`pwd`":/code  --mount type=volume,source="contracts_cache",target=/code/target --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cosmwasm/workspace-optimizer:0.12.3 &> /dev/null
fi

if [[ `blast run ./scripts/deploy.js` =~ 'cudos' ]]; then
    echo -e $PASSED
else
    echo -e $FAILED
    exit_status=1
fi

echo -n 'blast run -n [network]...'
# Set [defaultNetwork] to invalid value and add the local network to [networks] to ensure that the passing tests will
#  ignore [defaultNetwork]
perl -pi -e $'s|defaultNetwork: \'\'|defaultNetwork: \'https://an-inhospitable-node.cudos.org:26657\'|' blast.config.js
perl -pi -e $'s|networks: {|networks: {\tlocalhost_test: \'http://localhost:26657\',|' blast.config.js

if [[ `blast run ./scripts/deploy.js -n localhost_test` =~ 'cudos' ]]; then
    echo -e $PASSED
else
    echo -e $FAILED
    exit_status=1
fi

echo -n 'deploy and fund contract...'

perl -pi -e $'s|defaultNetwork: \'https://an-inhospitable-node.cudos.org:26657\'|defaultNetwork: \'\'|' blast.config.js
perl -i -pe $'if($. == 1) {s||const { coin } = require(\'\@cosmjs/stargate\');\n\n|}' ./scripts/deploy.js
perl -i -pe $'if($. == 4) {s||  const fund = [coin(321, \'acudos\')];\n|}' ./scripts/deploy.js
perl -pi -e 's|\(MSG_INIT\)|(MSG_INIT, fund)|' ./scripts/deploy.js

deployed_contract=`blast run ./scripts/deploy.js`
if [[ $deployed_contract =~ 'cudos' ]]; then
    echo -e $PASSED
else
    echo -e $FAILED
    exit_status=1
fi

echo -n 'verify contract balance...'
cd ..
contract_balance=`$COMPOSE cudos-noded q bank balances ${deployed_contract:22}`

if [[ $contract_balance =~ '321' ]]; then
    echo -e $PASSED
else
    echo -e $FAILED
    exit_status=1
fi

rm -r ./$init_folder &> /dev/null || true
exit $exit_status