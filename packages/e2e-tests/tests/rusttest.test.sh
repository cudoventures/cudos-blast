#!/bin/bash
source ./packages/e2e-tests/vars.sh
init_folder="$INIT_FOLDER-rusttest"

echo -n 'blast rusttest...'
cp -R $PATH_TO_TEMPLATE $init_folder &> /dev/null && cd $init_folder

blast rusttest -q &> cargo.logs.json
result=`cat cargo.logs.json`
if [[ ! $result =~ $RUSTTEST_RESULT ]]; then
    echo -e "$FAILED\n$EXPECTED\n$RUSTTEST_RESULT\n$ACTUAL\n$result" 1>&2
    exit_status=1
else
    echo -e $PASSED
fi

rm -r ../../../$init_folder &> /dev/null || true
exit $exit_status