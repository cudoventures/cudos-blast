source ./packages/cudos-test/_vars.sh
alias cleanup="$COMPOSE cudos-noded keys delete $TEST_ACC -y"

echo "Executing cudos keys add..."
cudos keys add $TEST_ACC &> /dev/null

if [[ ! `$COMPOSE cudos-noded keys list` =~ $TEST_KEY ]]; then
    echo "cudos keys add $FAILED\nThe key was not added successfuly!" 1>&2
    cleanup &> /dev/null && exit 1
fi
cleanup &> /dev/null && echo "cudos keys add $PASSED"
