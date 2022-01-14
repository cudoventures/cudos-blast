source ./test/_vars.test.sh

alias CLEANUP="rm -r ../$INIT_FOLDER"

echo 'TEST cudos test'
cudos init -d $INIT_FOLDER
cd $INIT_FOLDER
cudos compile
RESULT=`cudos test`
if [[ ! $RESULT == $TEST_RESULT ]]; then
    echo "TEST cudos test FAILED\n\nEXPECTED: $TEST_RESULT\n\nACTUAL: $RESULT" 1>&2
    CLEANUP && exit 1
fi
echo 'TEST cudos test SUCCESS'
CLEANUP && exit 0