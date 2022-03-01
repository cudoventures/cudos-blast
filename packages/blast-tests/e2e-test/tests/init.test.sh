#!/bin/bash
source ./packages/blast-tests/e2e-test/vars.sh

echo -n 'blast init...'
mkdir $INIT_FOLDER && cd $INIT_FOLDER
blast init &> /dev/null

if [[ ! `ls` == $TEMPLATE_FILES || ! `ls scripts` == $TEMPLATE_SCRIPTS_FILES ]]; then
    echo -e "$FAILED\nGenerated folder is invalid!" 1>&2
    exit_status=1
else
    echo -e "$PASSED"
fi

rm -r ../$INIT_FOLDER &> /dev/null
exit $exit_status
