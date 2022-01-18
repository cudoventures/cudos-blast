source ./packages/cudos-test/_vars.sh
alias cleanup="rm -r ../../$INIT_FOLDER"

echo "Running cudos compile..."
cp -R template $INIT_FOLDER &> /dev/null && cd $INIT_FOLDER
cudos compile &> /dev/null && cd artifacts

if [[ ! `ls -R` == $COMPILE_FILES ]]; then
    echo "cudos compile $FAILED\nInvalid artifacts!" 1>&2
    exit_status=1
else
    echo "cudos compile $PASSED"
fi

echo 'Running cudos run...'
if [[ ! `cudos run ../scripts/deploy.js` =~ 'cudos' ]]; then
    echo "cudos run $FAILED"
    exit_status=1
else
    echo "cudos run $PASSED"
fi
cleanup &> /dev/null && exit $exit_status