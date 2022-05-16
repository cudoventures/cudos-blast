#!/bin/bash
source ./vars.sh

echo -n 'blast keys fund...'
# can infinitely wait for some of the following commands maybe becausf of wrong cd ../..
$LOCAL_NODE_EXEC cudos-noded keys add $TEST_KEY --keyring-backend test &> /dev/null
cd $PATH_TO_TEMPLATE
blast keys fund $TEST_KEY -t 1 &> /dev/null
cd ..

test_address=`$LOCAL_NODE_EXEC cudos-noded keys show $TEST_KEY --keyring-backend test -a`
balance=`$LOCAL_NODE_EXEC cudos-noded q bank balances $test_address`
if [[ $balance =~ $BALANCE_AFTER_FUND ]]; then
    echo -e $PASSED
else
    echo -e "$FAILED\n$EXPECTED\n$BALANCE_AFTER_FUND\n$ACTUAL\n$balance" 1>&2
    exit_status=1
fi

$LOCAL_NODE_EXEC cudos-noded keys delete $TEST_KEY --keyring-backend test -y &> /dev/null
exit $exit_status