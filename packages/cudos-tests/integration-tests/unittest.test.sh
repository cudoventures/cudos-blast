#!/bin/bash
source ./packages/cudos-tests/integration-tests/_vars.sh

echo -n 'cudos unittest...'
cp -R template $INIT_FOLDER &> /dev/null && cd $INIT_FOLDER

result=`cudos unittest -q`
if [[ ! $result =~ $UNITTEST_RESULT ]]; then
    echo -e "$FAILED\n$EXPECTED\n$UNITTEST_RESULT\n$ACTUAL\n$result" 1>&2
    exit_status=1
else
    echo -e $PASSED
fi

rm -r ../$INIT_FOLDER
exit $exit_status