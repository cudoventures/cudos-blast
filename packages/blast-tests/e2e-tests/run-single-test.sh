#!/bin/bash
source ./packages/blast-tests/e2e-tests/vars.sh
compose='docker compose -f ./packages/blast-config/docker-compose-start.yaml -f ./packages/blast-config/docker-compose-init.yaml'
start_node() {
    $compose up --build -d &> /dev/null
    timer=45
    sleep $timer
    until [[ `$COMPOSE cudos-noded q block` =~ $VALID_BLOCK_STATUS ]]; do
        sleep $timer
    done;
}

if [[ ! `ls -a $TESTS_FOLDER` =~ $1 ]]; then
    echo 'Invalid test file!'
    exit 1
fi

if [[ $1 == 'node-start-status.test.sh' || $1 == 'node-start-custom-accounts.test.sh' ]]; then
    if [[ `docker ps` =~ $CONTAINER_NAME ]]; then
        echo "We are detecting a running node! In order to run the integration tests we need a fresh instance of Blast Node. Do you want us to restart it?"
        select yn in "Yes" "No"; do
        case $yn in
            Yes ) echo 'stopping node...'; $compose down &> /dev/null && sleep 5; break;;
            No ) exit $?;;
        esac
        done
    fi
    
    $TESTS_FOLDER/$1
    exit_status=$?
    $compose down &> /dev/null && sleep 5
    exit $exit_status
fi

start_node

echo "- Executing $1..."
$TESTS_FOLDER/$1
exit_status=$?

if [[ `docker ps` =~ $CONTAINER_NAME ]]; then
    echo 'Stopping the node...'
    $compose down &> /dev/null && sleep 5
fi

exit $exit_status