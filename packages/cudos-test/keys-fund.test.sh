source ./packages/cudos-test/_vars.sh
alias get_balance='$COMPOSE cudos-noded q bank balances `$COMPOSE cudos-noded keys show $TEST_KEY -a`'
alias cleanup="$COMPOSE cudos-noded keys delete $TEST_KEY -y"

echo "Executing cudos keys fund..."
$COMPOSE cudos-noded keys add $TEST_KEY &> /dev/null
cudos keys fund $TEST_KEY -t 1 &> /dev/null
RESULT=`get_balance`

if [[ ! $RESULT =~ $BALANCE_AFTER_FUND ]]; then
    echo "cudos keys fund $FAILED\n$EXPECTED\n$BALANCE_AFTER_FUND\n$ACTUAL\n$RESULT" 1>&2
    cleanup &> /dev/null && exit 1
fi
cleanup &> /dev/null && echo "cudos keys fund $PASSED"