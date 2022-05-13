#!/bin/bash
source ./vars.sh
init_folder="$INIT_FOLDER-config-test"
exit_status=0

echo -n 'blast node start...'
cp -R $PATH_TO_TEMPLATE $init_folder &> /dev/null
cd $init_folder

perl -pi -e 's/additionalAccounts: 0/additionalAccounts: 1/' blast.config.js
perl -pi -e 's/customAccountBalances: 1000000000000000000/customAccountBalances: 500/' blast.config.js

blast node start &> /dev/null
cd ..
sleep 45
timer=30
until [[ `$LOCAL_NODE_EXEC cudos-noded q block` =~ $VALID_BLOCK_STATUS ]]; do
    if (( $timer > 34 )); then
        echo -e "$FAILED\nNode was not started successfuly!\n'cudos noded q block' does not contain height!" 1>&2
        exit_status=1
        break
    fi
    sleep $timer
    ((timer=timer+1))
done;
exit_status=$?
if [[ $exit_status == 0 ]]; then
    echo -e $PASSED
fi

cd $init_folder

echo -n 'adding custom accounts...'

cd ..
if [[ `$LOCAL_NODE_EXEC cudos-noded keys list --keyring-backend test` =~ $ADDITIONAL_KEY ]]; then
    echo -e $PASSED
else
    echo -e $FAILED
    exit_status=1
fi

additional_account=`$LOCAL_NODE_EXEC cudos-noded keys show $ADDITIONAL_KEY --keyring-backend test -a`

echo -n 'validating custom balances...'
if [[ ! `$LOCAL_NODE_EXEC cudos-noded query bank balances $additional_account` =~ $CUSTOM_BALANCE ]]; then
    echo -e $FAILED
    exit_status=1
else
    echo -e $PASSED
fi

rm -r $init_folder &> /dev/null || true
exit $exit_status
