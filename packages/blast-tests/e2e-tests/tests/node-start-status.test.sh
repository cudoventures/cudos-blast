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

if [[ ! `blast node status` =~ 'online' ]]; then
    echo -e $FAILED
    exit_status=1
else
    echo -e $PASSED
fi

# executing node status on local network through --network; execute only if "blast node status" is passing
if [[ $exit_status != 1 ]]; then
    echo -n 'blast node status -n [network]...'
    # Add localhost to [networks] in the config
    sed -i '' $'s|networks: {|networks: {\tlocalhost_test: \'http://localhost:26657\',|' blast.config.js

    if [[ ! `blast node status -n localhost_test` =~ 'online' ]]; then
        echo -e $FAILED
        exit_status=1
    else
        echo -e $PASSED
    fi
fi

# make sure the local network is considered through --network by failing the "blast node status" on invalid url
if [[ $exit_status != 1 ]]; then
    echo -n 'blast node status -n [invalid_network]...'
    # Add invalid localhost to [networks] in the config
    sed -i '' $'s|networks: {|networks: {\tinvalid_localhost_test: \'http://non-existent-localhost:26657\', |' blast.config.js

    if [[ `blast node status -n invalid_localhost_test` =~ 'online' ]]; then
        echo -e $FAILED
        exit_status=1
    else
        echo -e $PASSED
    fi
fi

rm -r ../$init_folder &> /dev/null || true
exit $exit_status
