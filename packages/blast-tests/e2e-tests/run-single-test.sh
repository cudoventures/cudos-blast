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
        echo 'Node is started. Your node will be stopped and started again after the test is executed...'
        $compose down &> /dev/null && sleep 5
        node_stopped=true
    fi
    $TESTS_FOLDER/$1
    exit_status=$?
    if [[ $node_stopped == true && $exit_status == 1 ]]; then
        echo 'Getting your node back up...'
        start_node
    fi
    exit $exit_status
fi

if [[ ! `docker ps` =~ $CONTAINER_NAME && ($1 =~ 'keys' || $1 =~ 'node-stop' || $1 =~ 'run') ]]; then
    echo 'Node is not started. Your node will be started and stopped after the test is executed.'
    start_node
    node_started=true
fi
if [[ $1 =~ 'node-stop' && ! $node_started == true ]]; then
    echo 'Node is started. Your node will be stopped and started after the test is executed'
    node_stopped=true
fi
echo "- Executing $1..."
$TESTS_FOLDER/$1
exit_status=$?

if [[ $node_started == true && `docker ps` =~ $CONTAINER_NAME ]]; then
    echo 'Stopping the node...'
    $compose down &> /dev/null && sleep 5
elif [[ $node_stopped == true && ! `docker ps` == $CONTAINER_NAME ]]; then
    echo 'Getting your node back up...'
    start_node
fi

exit $exit_status