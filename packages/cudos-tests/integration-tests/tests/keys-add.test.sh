#!/bin/bash
source ./packages/cudos-tests/integration-tests/vars.sh

echo -n 'cudos keys add...'
cd template
cudos keys add $TEST_KEY &> /dev/null
cd ..

if [[ ! `$COMPOSE cudos-noded keys list` =~ $TEST_KEY ]]; then
    echo -e "$FAILED\nThe key was not added successfuly!" 1>&2
    exit_status=1
else
    echo -e $PASSED
fi

$COMPOSE cudos-noded keys delete $TEST_KEY -y &> /dev/null
exit $exit_status
