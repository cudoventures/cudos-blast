#!/bin/bash
source ./packages/cudos-tests/integration-tests/_vars.sh

echo -n 'cudos compile...'
cp -R template $INIT_FOLDER &> /dev/null
cd $INIT_FOLDER
cudos compile &> /dev/null
cd artifacts

if [[ ! `ls -R` == $COMPILE_FILES ]]; then
    echo -e "$FAILED\nInvalid artifacts!" 1>&2
    exit_status=1
else
    echo -e $PASSED
fi

echo -n 'cudos run...'
cd ..
if [[ $exit_status == 1 ]]; then
    docker run --rm -v "$INIT_FOLDER":/code  --mount type=volume,source="contracts_cache",target=/code/target --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cosmwasm/workspace-optimizer:0.12.3
fi
if [[ ! `cudos run ./scripts/deploy.js` =~ 'cudos' ]]; then
    echo -e $FAILED
    exit_status=1
else
    echo -e $PASSED
fi

rm -r ../$INIT_FOLDER &> /dev/null
exit $exit_status