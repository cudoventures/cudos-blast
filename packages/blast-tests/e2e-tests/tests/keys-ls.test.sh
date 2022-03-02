#!/bin/bash
source ./packages/blast-tests/e2e-tests/vars.sh

echo -n 'blast keys ls...'
$COMPOSE cudos-noded keys add $TEST_KEY --keyring-backend test &> /dev/null
cd template
if [[ ! `blast keys ls` =~ $TEST_KEY ]]; then
    echo -e $FAILED 1>&2
    exit_status=1
fi

cd ..
$COMPOSE cudos-noded keys delete $TEST_KEY --keyring-backend test -y &> /dev/null
cd template
if [[ `blast keys ls` =~ $TEST_KEY ]]; then
        echo -e $FAILED 1>&2
        exit_status=1  
fi

if [[ ! $exit_status == 1 ]]; then
 echo -e $PASSED
fi

exit $exit_status