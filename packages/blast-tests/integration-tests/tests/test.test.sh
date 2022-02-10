#!/bin/bash
source ./packages/blast-tests/integration-tests/vars.sh

echo -n 'blast test...'
cp -R template $INIT_FOLDER &> /dev/null && cd $INIT_FOLDER
docker run --rm -v "`pwd`":/code  --mount type=volume,source="contracts_cache",target=/code/target --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cosmwasm/workspace-optimizer:0.12.3 &> /dev/null
npm install &> /dev/null

result=`blast test`
if [[ ! $result =~ $TEST_RESULT ]]; then
    echo -e "$FAILED\n$EXPECTED\n$TEST_RESULT\n$ACTUAL\n$result" 1>&2
    exit_status=1
else
    echo -e $PASSED
fi

rm -r ../$INIT_FOLDER
exit $exit_status