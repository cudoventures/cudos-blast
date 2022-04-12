#!/bin/bash
source ./packages/blast-tests/e2e-tests/vars.sh

init_folder="$INIT_FOLDER-start-status"
cp -R template $init_folder &> /dev/null
cd $init_folder

echo -n 'blast node start...'

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

if [[ `blast node status` =~ 'online' ]]; then
    echo -e $PASSED
else
    echo -e $FAILED
    exit_status=1
fi

echo -n 'blast node status -n [network]...'
# Set [defaultNetwork] to invalid value and add the local network to [networks] to ensure that the passing tests will
#  ignore [defaultNetwork]
sed -i '' $'s|defaultNetwork: \'\'|defaultNetwork: \'https://an-inhospitable-node.cudos.org:26657\'|' blast.config.js
sed -i '' $'s|networks: {|networks: {\tlocalhost_test: \'http://localhost:26657\',|' blast.config.js

if [[ `blast node status -n localhost_test` =~ 'online' ]]; then
    echo -e $PASSED
else
    echo -e $FAILED
    exit_status=1
fi

rm -r ../$init_folder &> /dev/null || true
exit $exit_status
