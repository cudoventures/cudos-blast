#!/bin/bash
source ./packages/blast-tests/e2e-tests/vars.sh

echo -n 'blast keys fund...'
$COMPOSE cudos-noded keys add $TEST_KEY --keyring-backend test &> /dev/null
cd template
blast keys fund $TEST_KEY -t 1 &> /dev/null
cd ..

test_address=`$COMPOSE cudos-noded keys show $TEST_KEY --keyring-backend test -a`
balance=`$COMPOSE cudos-noded q bank balances $test_address`
if [[ $balance =~ $BALANCE_AFTER_FUND ]]; then
    echo -e $PASSED
else
    echo -e "$FAILED\n$EXPECTED\n$BALANCE_AFTER_FUND\n$ACTUAL\n$balance" 1>&2
    exit_status=1
fi

$COMPOSE cudos-noded keys delete $TEST_KEY --keyring-backend test -y &> /dev/null
exit $exit_status