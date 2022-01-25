#!/bin/bash
source ./packages/blast-tests/integration-tests/vars.sh

echo -n 'blast init -d...'
blast init -d $INIT_FOLDER &> /dev/null && cd $INIT_FOLDER

if [[ ! `ls -R` == $TEMPLATE_FILES ]]; then
    echo -e "$FAILED\nGenerated folder is invalid!" 1>&2
    exit_status=1
else
    echo -e "$PASSED"
fi

rm -r ../$INIT_FOLDER &> /dev/null
exit $exit_status