#!/bin/bash
source ./packages/e2e-tests/vars.sh

echo -n 'blast keys add...'
cd $PATH_TO_TEMPLATE
blast keys add $TEST_KEY -t &> /dev/null
cd ../../..

if [[ `$LOCAL_NODE_EXEC cudos-noded keys list --keyring-backend test` =~ $TEST_KEY ]]; then
    echo -e $PASSED
else
    echo -e "$FAILED\nThe key was not added successfuly!" 1>&2
    exit_status=1
fi

$LOCAL_NODE_EXEC cudos-noded keys delete $TEST_KEY --keyring-backend test -y &> /dev/null
exit $exit_status
