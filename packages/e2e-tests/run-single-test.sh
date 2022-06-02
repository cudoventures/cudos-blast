#!/bin/bash
source ./vars.sh
start_node() {
    $DOCKER_COMPOSE up --build -d &> /dev/null
    timer=45
    sleep $timer
    until [[ `$LOCAL_NODE_EXEC cudos-noded q block` =~ $VALID_BLOCK_STATUS ]]; do
        sleep $timer
    done;
}

if [[ ! `ls -a $TESTS_FOLDER` =~ $1 ]]; then
    echo 'Invalid test file!'
    exit 1
fi

if [[ $1 == 'node-start-status.test.sh' || $1 == 'node-start-custom-accounts.test.sh' ]]; then
    if [[ `docker ps` =~ $CONTAINER_NAME ]]; then
        echo "A running node is detected. The end-to-end tests requires a fresh instance of a Blast node. Do you want to restart it?"
        select yn in "Yes" "No"; do
        case $yn in
            Yes ) echo 'stopping node...'; $DOCKER_COMPOSE down &> /dev/null && sleep 5; break;;
            No ) exit $?;;
        esac
        done
    fi
    
    $TESTS_FOLDER/$1
    exit_status=$?
    $DOCKER_COMPOSE down &> /dev/null && sleep 5
    exit $exit_status
fi

if [[ $1 == 'keys-add.test.sh' || $1 == 'keys-fund.test.sh' || $1 == 'keys-ls.test.sh' 
|| $1 == 'keys-rm.test.sh' || $1 == 'node-stop-status.test.sh' 
|| $1 == 'compile-run.test.sh' || 'test.test.sh' ]]; then
    start_node
fi
echo "- Executing $1..."
$TESTS_FOLDER/$1
exit_status=$?

if [[ `docker ps` =~ $CONTAINER_NAME ]]; then
    echo 'Stopping the node...'
    $DOCKER_COMPOSE down &> /dev/null && sleep 5
fi

exit $exit_status