source ./packages/cudos-test/_vars.sh
alias cleanup="$COMPOSE cudos-noded keys delete $TEST_ACC -y"

echo "Executing cudos keys rm..."
$COMPOSE keys add $TEST_ACC &> /dev/null
cudos keys rm $TEST_ACC -f &> /dev/null

if [[ `$COMPOSE cudos-noded keys list` =~ $TEST_KEY ]]; then
    echo "cudos keys rm $FAILED\nKey was not removed successfuly!" 1>&2
    cleanup &> /dev/null
    exit 1
fi
echo "cudos keys rm $PASSED"