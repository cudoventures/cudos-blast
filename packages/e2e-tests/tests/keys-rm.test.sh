#!/bin/bash
source ./vars.sh

echo -n 'blast keys rm...'
$LOCAL_NODE_EXEC keys add $TEST_KEY &> /dev/null
cd $PATH_TO_TEMPLATE
blast keys rm $TEST_KEY -f &> /dev/null
cd ..

if [[ `$LOCAL_NODE_EXEC cudos-noded keys list --keyring-backend test` =~ $TEST_KEY ]]; then
    echo -e "$FAILED\nKey was not removed successfuly!" 1>&2
    $LOCAL_NODE_EXEC cudos-noded keys delete $TEST_KEY -y --keyring-backend test &> /dev/null
    exit_status=1
else
    echo -e $PASSED
fi

exit $exit_status