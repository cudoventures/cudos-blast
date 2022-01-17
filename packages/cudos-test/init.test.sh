source ./packages/cudos-test/_vars.sh
alias cleanup="cd .. && rm -r $INIT_FOLDER"

echo "Executing cudos init..."
mkdir $INIT_FOLDER && cd $INIT_FOLDER
cudos init &> /dev/null

if [[ ! `ls -R` == $TEMPLATE_FILES ]]; then
        echo "cudos init $FAILED\nGenerated folder is invalid!" 1>&2
        cleanup &> /dev/null && exit 1
    fi
cleanup &> /dev/null && echo "cudos init $PASSED"