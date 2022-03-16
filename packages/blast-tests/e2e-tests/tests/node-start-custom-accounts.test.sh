#!/bin/bash
source ./packages/blast-tests/e2e-tests/vars.sh
init_folder="$INIT_FOLDER-config-test"

echo -n 'blast node start...'
cp -R template $init_folder &> /dev/null && cd $init_folder

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

cd $init_folder
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

rm -r $init_folder &> /dev/null || true
exit $exit_status
