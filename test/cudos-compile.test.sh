source ./test/_vars.test.sh

alias CLEANUP="rm -r ../../$INIT_FOLDER"

echo 'TEST cudos compile'
cudos init -d $INIT_FOLDER
cd $INIT_FOLDER
cudos compile
cd artifacts
RESULT=`ls -R`
if [[ ! $RESULT == $COMPILE_FILES ]]; then
    echo "TEST cudos compile FAILED\n\nEXPECTED: $RESULT\n\nACTUAL: $COMPILE_FILES" 1>&2
    CLEANUP && exit 1
fi
echo 'TEST cudos compile SUCCESS'
CLEANUP && exit 0
