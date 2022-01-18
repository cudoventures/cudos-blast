source ./packages/cudos-test/_vars.sh
alias cleanup="rm -r ../$INIT_FOLDER"

echo "Running cudos test..."
cp -R template $INIT_FOLDER &> /dev/null && cd $INIT_FOLDER
RESULT=`cudos test`

if [[ ! $RESULT == $TEST_RESULT ]]; then
    echo "cudos test $FAILED\n$EXPECTED\n$TEST_RESULT\n$ACTUAL\n$RESULT" 1>&2
    cleanup &> /dev/null && exit 1
fi
cleanup &> /dev/null && echo "cudos test $PASSED"
