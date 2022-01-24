#!/bin/bash
source ./packages/cudos-test/_vars.sh

echo -n 'cudos test...'
cp -R template $INIT_FOLDER &> /dev/null && cd $INIT_FOLDER

result=`cudos test`
if [[ ! $result == $TEST_RESULT ]]; then
    echo -e "$FAILED\n$EXPECTED\n$TEST_RESULT\n$ACTUAL\n$result" 1>&2
    exit_status=1
else
    echo -e $PASSED
fi

rm -r ../$INIT_FOLDER
exit $exit_status