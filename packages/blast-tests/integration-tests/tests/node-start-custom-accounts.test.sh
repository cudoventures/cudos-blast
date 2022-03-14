#!/bin/bash
source ./packages/blast-tests/integration-tests/vars.sh

echo -n 'blast node start...'

cd template

sed -i '' 's/additionalAccounts: 0/additionalAccounts: 1/' blast.config.js
sed -i '' 's/customAccountBalances: 1000000000000000000/customAccountBalances: 500/' blast.config.js

blast node start &> /dev/null
cd ..
sleep 45
timer=30
until [[ `$COMPOSE cudos-noded q block` =~ $VALID_BLOCK_STATUS ]]; do
    if (( $timer > 34 )); then
        echo -e "$FAILED\nNode was not started successfuly!\n'cudos noded q block' does not contain height!" 1>&2
        exit_status=1
        break
    fi
    sleep $timer
    ((timer=timer+1))
done;
if [[ ! $exit_status == 1 ]]; then
    echo -e $PASSED
fi

echo -n 'blast node status...'
if [[ $exit_status == 1 ]]; then
    $compose up --build -d &> /dev/null
    timer=45
    sleep $timer
    until [[ `$COMPOSE cudos-noded q block` =~ $VALID_BLOCK_STATUS ]]; do
        sleep $timer
    done;
fi

cd template
if [[ ! `blast node status` =~ 'online' ]]; then
    echo -e $FAILED
    exit_status=1
else
    echo -e $PASSED
fi

echo -n 'added custom accounts...'

cd ..
if [[ ! `$COMPOSE cudos-noded keys list --keyring-backend test` =~ $ADDITIONAL_KEY ]]; then
    echo -e $FAILED
    exit_status=1
else
    echo -e $PASSED
fi

additional_account=`$COMPOSE cudos-noded keys show $ADDITIONAL_KEY --keyring-backend test -a`

echo -n 'added custom balances...'
if [[ ! `$COMPOSE cudos-noded query bank balances $additional_account` =~ $CUSTOM_BALANCE ]]; then
    echo -e $FAILED
    exit_status=1
else
    echo -e $PASSED
fi

cd template
sed -i '' 's/additionalAccounts: 1/additionalAccounts: 0/' blast.config.js
sed -i '' 's/customAccountBalances: 500/customAccountBalances: 1000000000000000000/' blast.config.js


exit $exit_status
