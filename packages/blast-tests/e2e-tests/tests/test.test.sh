#!/bin/bash
source ./packages/blast-tests/e2e-tests/vars.sh
init_folder="$INIT_FOLDER-test"

echo -n 'blast test...'
cp -R template $init_folder &> /dev/null && cd $init_folder
docker run --rm -v "`pwd`":/code  --mount type=volume,source="contracts_cache",target=/code/target --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cosmwasm/workspace-optimizer:0.12.3 &> /dev/null

blast test &> jest.logs.json
result=`cat jest.logs.json`
if [[ $result =~ $TEST_RESULT ]]; then
    echo -e $PASSED
else
    echo -e "$FAILED\n$EXPECTED\n$TEST_RESULT\n$ACTUAL\n$result" 1>&2
    exit_status=1
fi

echo -n 'blast test -n [network]...'
# Set [defaultNetwork] to invalid value and add the local network to [networks] to ensure that the passing tests will
#  ignore [defaultNetwork]
sed -i '.bak' $'s|defaultNetwork: \'\'|defaultNetwork: \'https://an-inhospitable-node.cudos.org:26657\'|' blast.config.js
sed -i '.bak' $'s|networks: {|networks: {\tlocalhost_test: \'http://localhost:26657\',|' blast.config.js

blast test -n localhost_test &> jest.logs.json
result=`cat jest.logs.json`
if [[ $result =~ $TEST_RESULT ]]; then
    echo -e $PASSED
else
    echo -e "$FAILED\n$EXPECTED\n$TEST_RESULT\n$ACTUAL\n$result" 1>&2
    exit_status=1
fi

rm -r ../$init_folder &> /dev/null || true
exit $exit_status