#!/bin/bash
source ./vars.sh

init_folder="$INIT_FOLDER-compile"
cp -R $PATH_TO_TEMPLATE $init_folder &> /dev/null
#manually supply the testing folder with accounts.json
cp -f $DEFAULT_ACCOUNTS_FILE_PATH "$init_folder/accounts.json"
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

# executing blast run on the local network through --network; execute only if "blast run" is passing
if [[ $exit_status != 1 ]]; then
    echo -n 'blast run -n [network]...'
    # Add localhost to [networks] in the config
    perl -pi -e $'s|networks: {|networks: {\tlocalhost_test: \'http://localhost:26657\',|' blast.config.js

    if [[ `blast run ./scripts/deploy.js -n localhost_test` =~ 'cudos' ]]; then
        echo -e $PASSED
    else
        echo -e $FAILED
        exit_status=1
    fi
fi

echo -n 'deploy and fund contract...'

# tweak the deploy script to get cudos and pass it to the deploy function
perl -i -pe $'if($. == 1) {s||const { coin } = require(\'\@cosmjs/stargate\');\n\n|}' ./scripts/deploy.js
perl -i -pe $'if($. == 4) {s||  const fund = [coin(321, \'acudos\')];\n|}' ./scripts/deploy.js
perl -pi -e 's|deploy\(MSG_INIT|deploy(MSG_INIT, { funds: fund}|' ./scripts/deploy.js

deployed_contract=`blast run ./scripts/deploy.js`
if [[ $deployed_contract =~ 'cudos' ]]; then
    echo -e $PASSED
else
    echo -e $FAILED
    exit_status=1
fi

echo -n 'verify contract balance...'
cd ..
contract_balance=`$LOCAL_NODE_EXEC cudos-noded q bank balances ${deployed_contract:22}`

if [[ $contract_balance =~ '321' ]]; then
    echo -e $PASSED
else
    echo -e $FAILED
    exit_status=1
fi

rm -r -f ./$init_folder &> /dev/null || true
exit $exit_status