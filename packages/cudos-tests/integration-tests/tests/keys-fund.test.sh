#!/bin/bash
source ./packages/cudos-tests/integration-tests/vars.sh

echo -n 'cudos keys fund...'
$COMPOSE cudos-noded keys add $TEST_KEY &> /dev/null
cd template
cudos keys fund $TEST_KEY -t 1 &> /dev/null
cd ..

test_address=`$COMPOSE cudos-noded keys show $TEST_KEY -a`
balance=`$COMPOSE cudos-noded q bank balances $test_address`
if [[ ! $balance =~ $BALANCE_AFTER_FUND ]]; then
    echo -e "cudos keys fund $FAILED\n$EXPECTED\n$BALANCE_AFTER_FUND\n$ACTUAL\n$balance" 1>&2
    exit_status=1
else
    echo -e $PASSED
fi

$COMPOSE cudos-noded keys delete $TEST_KEY -y &> /dev/null
exit $exit_status