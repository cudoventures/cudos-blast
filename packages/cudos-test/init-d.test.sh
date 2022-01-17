source ./packages/cudos-test/_vars.sh
alias cleanup="cd .. && rm -r $INIT_FOLDER"

echo "Executing cudos init -d..."
cudos init -d $INIT_FOLDER &> /dev/null && cd $INIT_FOLDER

if [[ ! `ls -R` == $TEMPLATE_FILES ]]; then
        echo "cudos init -d $FAILED\nGenerated folder is invalid!" 1>&2
        cleanup &> /dev/null && exit 1
    fi
cleanup &> /dev/null && echo "cudos init -d $PASSED"