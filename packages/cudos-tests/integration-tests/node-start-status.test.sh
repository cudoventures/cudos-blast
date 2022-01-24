#!/bin/bash
source ./packages/cudos-tests/integration-tests/_vars.sh

echo -n 'cudos node start...'
cd template
cudos node start -d &> /dev/null
cd ..
sleep 45
timer=30
until [[ `$COMPOSE cudos-noded q block` =~ $VALID_BLOCK_STATUS ]]; do
    if (( $timer > 34 )); then
        echo -e "$FAILED\nNode was not started successfuly!\n'cudos noded q block' does not contain height!" 1>&2
        exit_status=1
    fi
    sleep $timer
    ((timer=timer+1))
done;
if [[ ! $exit_status == 1 ]]; then
    echo -e $PASSED
fi

echo -n 'cudos node status...'
if [[ $exit_status == 1 ]]; then
    $compose up --build -d &> /dev/null
    timer=45
    sleep $timer
    until [[ `$COMPOSE cudos-noded q block` =~ $VALID_BLOCK_STATUS ]]; do
        sleep $timer
    done;
fi
cd template
if [[ ! `cudos node status` =~ 'online' ]]; then
    echo -e $FAILED
    exit_status=1
else
    echo -e $PASSED
fi

exit $exit_status
