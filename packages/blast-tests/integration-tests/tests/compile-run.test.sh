#!/bin/bash
source ./packages/blast-tests/integration-tests/vars.sh

echo -n 'blast compile...'
cp -R template $INIT_FOLDER &> /dev/null
cd $INIT_FOLDER
blast compile &> /dev/null
cd artifacts

if [[ ! `ls -R` == $COMPILE_FILES ]]; then
    echo -e "$FAILED\nInvalid artifacts!" 1>&2
    exit_status=1
else
    echo -e $PASSED
fi

echo -n 'blast run...'
cd ..
if [[ $exit_status == 1 ]]; then
    docker run --rm -v "$INIT_FOLDER":/code  --mount type=volume,source="contracts_cache",target=/code/target --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cosmwasm/workspace-optimizer:0.12.3
fi
if [[ ! `blast run ./scripts/deploy.js` =~ 'blast' ]]; then
    echo -e $FAILED
    exit_status=1
else
    echo -e $PASSED
fi

rm -r ../$INIT_FOLDER &> /dev/null
exit $exit_status