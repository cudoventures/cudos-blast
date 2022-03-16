#!/bin/bash
source ./packages/blast-tests/e2e-tests/vars.sh
if [[ ! $? == 0 ]]; then
    echo -e "Invalid source!" 1>&2
    exit $?
fi

compose='docker compose -f ./packages/blast-config/docker-compose-start.yaml -f ./packages/blast-config/docker-compose-init.yaml'
start_node() {
    $compose up --build -d &> /dev/null
    timer=45
    sleep $timer
    until [[ `$COMPOSE cudos-noded q block` =~ $VALID_BLOCK_STATUS ]]; do
        sleep $timer
    done;
}

if [[ $1 ]]; then
    ./packages/blast-tests/e2e-tests/run-single-test.sh $1
    exit $?
fi

if [[ `docker ps` =~ $CONTAINER_NAME ]]; then
    echo 'Node is started. Your node will be stopped and started again after the tests are executed...'
    $compose down &> /dev/null && sleep 5
    node_stopped=true
fi

echo '- Executing node-start-custom-accounts.test.sh...'
$TESTS_FOLDER/node-start-custom-accounts.test.sh
if [[ ! $? == 0 ]]; then
    exit_status=$?
fi
$compose down &> /dev/null && sleep 5

echo '- Executing node-start-status.test.sh...'
$TESTS_FOLDER/node-start-status.test.sh
if [[ ! $? == 0 ]]; then
    exit_status=$?
    start_node
fi

for test in $TESTS_FOLDER/*.test.sh; do
    if [[ ! $test =~ 'node' ]]; then
        split=(${test//// })
        file_name=${split[5]}
        echo "- Executing $file_name..."
        $test
        if [[ ! $? == 0 ]]; then
            exit_status=$?
        fi
    fi
done

echo '- Executing node-stop-status.test.sh...'
$TESTS_FOLDER/node-stop-status.test.sh
if [[ ! $? == 0 ]]; then
    exit_status=$?
fi
if [[ ! $node_stopped == true && `docker ps` =~ $CONTAINER_NAME ]]; then
    $compose down &> /dev/null && sleep 5
elif [[ $node_stopped == true && ! `docker ps` =~ $CONTAINER_NAME ]]; then
    echo 'Getting your node back up...'
    start_node
fi

exit $exit_status