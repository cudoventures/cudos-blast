#!/bin/bash
source ./packages/blast-tests/e2e-tests/vars.sh
init_folder="$INIT_FOLDER-test"

echo -n 'blast test...'
cp -R template $init_folder &> /dev/null && cd $init_folder
docker run --rm -v "`pwd`":/code  --mount type=volume,source="contracts_cache",target=/code/target --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cosmwasm/workspace-optimizer:0.12.3 &> /dev/null

blast test &> jest.logs.json
result=`cat jest.logs.json`
if [[ ! $result =~ $TEST_RESULT ]]; then
    echo -e "$FAILED\n$EXPECTED\n$TEST_RESULT\n$ACTUAL\n$result" 1>&2
    exit_status=1
else
    echo -e $PASSED
fi

echo -n 'blast test -n [network]...'
# Setup config to allow local node connection (and therefore successful run) only for passed --network parameter
# invalidate [localNetwork] and [defaultNetwork] values and add valid local network to [networks]
sed -i '' $'s|localNetwork: \'http://localhost:26657\'|localNetwork: \'https://sentry1.gcp-uscentral1.cudos.org:26657\'|' blast.config.js
sed -i '' $'s|defaultNetwork: \'\'|defaultNetwork: \'https://sentry1.gcp-uscentral1.cudos.org:26657\'|' blast.config.js
sed -i '' $'s|networks: {|networks: {\tlocalhost_test: \'http://localhost:26657\',|' blast.config.js

blast test -n localhost_test &> jest.logs.json
result=`cat jest.logs.json`
if [[ ! $result =~ $TEST_RESULT ]]; then
    echo -e "$FAILED\n$EXPECTED\n$TEST_RESULT\n$ACTUAL\n$result" 1>&2
    exit_status=1
else
    echo -e $PASSED
fi

rm -r ../$init_folder &> /dev/null || true
exit $exit_status