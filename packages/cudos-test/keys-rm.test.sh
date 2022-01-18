source ./packages/cudos-test/_vars.sh
alias cleanup="$COMPOSE cudos-noded keys delete $TEST_KEY -y"

echo "Running cudos keys rm..."
$COMPOSE keys add $TEST_KEY &> /dev/null
cudos keys rm $TEST_KEY -f &> /dev/null

if [[ `$COMPOSE cudos-noded keys list` =~ $TEST_KEY ]]; then
    echo "cudos keys rm $FAILED\nKey was not removed successfuly!" 1>&2
    cleanup &> /dev/null
    exit 1
fi
echo "cudos keys rm $PASSED"