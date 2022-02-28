#!/bin/bash
source ./packages/blast-tests/integration-tests/vars.sh

echo -n 'blast keys add...'
cd template
blast keys add $TEST_KEY -t &> /dev/null
cd ..

if [[ ! `$COMPOSE cudos-noded keys list --keyring-backend test` =~ $TEST_KEY ]]; then
    echo -e "$FAILED\nThe key was not added successfuly!" 1>&2
    exit_status=1
else
    echo -e $PASSED
fi

$COMPOSE cudos-noded keys delete $TEST_KEY --keyring-backend test -y &> /dev/null
exit $exit_status
