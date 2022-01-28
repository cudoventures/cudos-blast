#!/bin/bash
source ./packages/blast-tests/integration-tests/vars.sh
init_folder="$INIT_FOLDER-unittest"

echo -n 'blast unittest...'
cp -R template $init_folder &> /dev/null && cd $init_folder

result=`blast unittest -q`
if [[ ! $result =~ $UNITTEST_RESULT ]]; then
    echo -e "$FAILED\n$EXPECTED\n$UNITTEST_RESULT\n$ACTUAL\n$result" 1>&2
    exit_status=1
else
    echo -e $PASSED
fi

rm -r ../$init_folder &> /dev/null || true
exit $exit_status