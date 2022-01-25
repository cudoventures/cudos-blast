#!/bin/bash
source ./packages/cudos-tests/integration-tests/vars.sh

echo -n 'cudos keys ls...'
$COMPOSE cudos-noded keys add $TEST_KEY &> /dev/null
cd template
if [[ ! `cudos keys ls` =~ $TEST_KEY ]]; then
    echo -e $FAILED 1>&2
    exit_status=1
fi

cd ..
$COMPOSE cudos-noded keys delete $TEST_KEY -y &> /dev/null
cd template
if [[ `cudos keys ls` =~ $TEST_KEY ]]; then
        echo -e $FAILED 1>&2
        exit_status=1  
fi

if [[ ! $exit_status == 1 ]]; then
 echo -e $PASSED
fi

exit $exit_status