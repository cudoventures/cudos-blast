#!/bin/bash
source ./packages/blast-tests/e2e-tests/vars.sh

init_folder="$INIT_FOLDER-compile"
cp -R template $init_folder &> /dev/null
cd $init_folder

blast compile &> /dev/null

echo -n 'deploying contract...'
deployed_contract=`blast run ./scripts/deploy.js` &> /dev/null

if [[ $deployed_contract =~ 'cudos' ]]; then
    echo -e $PASSED
else
    echo -e $FAILED
    exit_status=1
fi

cd ..
echo -n 'verify contract balance...'

if [[ `$COMPOSE cudos-noded q bank balances ${deployed_contract:22}` =~ '321' ]]; then
    echo -e $PASSED
else
    echo -e $FAILED
    exit_status=1
fi

rm -r ./$init_folder &> /dev/null || true
exit $exit_status