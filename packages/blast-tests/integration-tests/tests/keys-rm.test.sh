#!/bin/bash
source ./packages/blast-tests/integration-tests/vars.sh

echo -n 'blast keys rm...'
$COMPOSE keys add $TEST_KEY &> /dev/null
cd template
blast keys rm $TEST_KEY -f &> /dev/null
cd ..

if [[ `$COMPOSE cudos-noded keys list` =~ $TEST_KEY ]]; then
    echo -e "$FAILED\nKey was not removed successfuly!" 1>&2
    $COMPOSE cudos-noded keys delete $TEST_KEY -y &> /dev/null
    exit_status=1
else
    echo -e $PASSED
fi

exit $exit_status