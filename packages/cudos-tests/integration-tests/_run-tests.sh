#!/bin/bash
source ./packages/cudos-tests/integration-tests/_vars.sh
alias block_status='$COMPOSE cudos-noded q block'
compose='docker compose -f ./packages/cudos-config/docker-compose-start.yaml -f ./packages/cudos-config/docker-compose-init.yaml'
start_node() {
    $compose up --build -d &> /dev/null
    timer=45
    sleep $timer
    until [[ `$COMPOSE cudos-noded q block` =~ $VALID_BLOCK_STATUS ]]; do
        sleep $timer
    done;
}

if [[ $1 ]]; then
    $TESTS_FOLDER/_run-single-test.sh $1
    exit $?
fi

if [[ `docker ps` =~ $CONTAINER_NAME ]]; then
    echo 'Node is started. Your node will be stopped and started again after the tests are executed...'
    $compose down &> /dev/null && sleep 5
    node_stopped=true
fi

echo 'Executing node-start-status.test.sh...'
$TESTS_FOLDER/node-start-status.test.sh
if [[ $? == 1 ]]; then
    exit_status=1
    start_node
fi

for test in $TESTS_FOLDER/*.test.sh; do
    if [[ ! $test =~ 'node' ]]; then
        split=(${test//// })
        file_name=${split[4]}
        echo "Executing $file_name..."
        $test
        if [[ $? == 1 ]]; then
            exit_status=1
        fi
    fi
done

echo 'Executing node-stop-status.test.sh...'
$TESTS_FOLDER/node-stop-status.test.sh
if [[ $? == 1 ]]; then
    exit_status=1
fi
if [[ ! $node_stopped == true && `docker ps` =~ $CONTAINER_NAME ]]; then
    $compose down &> /dev/null && sleep 5
elif [[ $node_stopped == true && ! `docker ps` =~ $CONTAINER_NAME ]]; then
    echo 'Getting your node back up...'
    start_node
fi

exit $exit_status