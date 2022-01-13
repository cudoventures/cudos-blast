source ./test/_vars.test.sh

echo TEST cudos compile
cudos init -d $INIT_FOLDER
cd $INIT_FOLDER
cudos compile
cd artifacts
if [[ ! `ls -R` == $COMPILE_FILES ]]; then
    echo TEST cudos compile FAILED
    rm -r ../../$INIT_FOLDER && rm -r ../../cudos-data
    exit 1
fi
echo TEST cudos compile SUCCESS
# todo research why cudos compile generates cudos-data folder
rm -r ../../$INIT_FOLDER && rm -r ../../cudos-data
exit 0