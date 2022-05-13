#!/bin/bash
source ./vars.sh

echo -n 'blast keys ls...'
$LOCAL_NODE_EXEC cudos-noded keys add $TEST_KEY --keyring-backend test &> /dev/null
cd $PATH_TO_TEMPLATE
if [[ ! `blast keys ls` =~ $TEST_KEY ]]; then
    echo -e $FAILED 1>&2
    exit_status=1
fi

cd ../..
$LOCAL_NODE_EXEC cudos-noded keys delete $TEST_KEY --keyring-backend test -y &> /dev/null
cd $PATH_TO_TEMPLATE
if [[ `blast keys ls` =~ $TEST_KEY ]]; then
        echo -e $FAILED 1>&2
        exit_status=1  
fi
exit_status=$?
if [[ $exit_status == 0 ]]; then
 echo -e $PASSED
fi

exit $exit_status