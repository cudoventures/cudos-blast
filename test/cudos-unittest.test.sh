source ./test/_vars.test.sh

alias CLEANUP="rm -r ../$INIT_FOLDER"

echo 'TEST cudos unittest'
cudos init -d $INIT_FOLDER
cd $INIT_FOLDER
cudos compile
RESULT=`cudos unittest`
if [[ ! $RESULT =~ $UNITTEST_RESULT ]]; then
    echo "TEST cudos unittest FAILED\n\nEXPECTED: $UNITTEST_RESULT\n\nACTUAL: $RESULT" 1>&2
    CLEANUP && exit 1
fi
echo 'TEST cudos unittest SUCCESS'
CLEANUP && exit 0