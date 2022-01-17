source ./packages/cudos-test/_vars.sh
alias cleanup="rm -r ../$INIT_FOLDER"

echo "Executing cudos unittest..."
cp -R template $INIT_FOLDER &> /dev/null && cd $INIT_FOLDER
RESULT=`cudos unittest -q`

if [[ ! $RESULT =~ $UNITTEST_RESULT ]]; then
    echo "cudos unittest $FAILED\n$EXPECTED\n$UNITTEST_RESULT\n$ACTUAL\n$RESULT" 1>&2
    cleanup &> /dev/null && exit 1
fi
cleanup &> /dev/null && echo "cudos unittest $PASSED"