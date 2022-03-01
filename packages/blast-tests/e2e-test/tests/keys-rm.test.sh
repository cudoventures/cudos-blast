#!/bin/bash
source ./packages/blast-tests/e2e-test/vars.sh

echo -n 'blast keys rm...'
$COMPOSE keys add $TEST_KEY &> /dev/null
cd template
blast keys rm $TEST_KEY -f &> /dev/null
cd ..

if [[ `$COMPOSE cudos-noded keys list --keyring-backend test` =~ $TEST_KEY ]]; then
    echo -e "$FAILED\nKey was not removed successfuly!" 1>&2
    $COMPOSE cudos-noded keys delete $TEST_KEY -y --keyring-backend test &> /dev/null
    exit_status=1
else
    echo -e $PASSED
fi

exit $exit_status