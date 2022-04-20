#!/bin/bash
source ./packages/e2e-tests/vars.sh

if  [[ `docker info` =~ $DOCKER_ERROR ]]; then
    echo -e "Cannot connect to the Docker daemon. Is the docker daemon running?" 1>&2
    exit $?
fi

if [[ ! $? == 0 ]]; then
    echo -e "Invalid source!" 1>&2
    exit $?
fi

compose='docker compose -f ./packages/blast-core/config/docker-compose-start.yaml -f ./packages/blast-core/config/docker-compose-init.yaml'
start_node() {
    $compose up --build -d &> /dev/null
    timer=45
    sleep $timer
    until [[ `$COMPOSE cudos-noded q block` =~ $VALID_BLOCK_STATUS ]]; do
        sleep $timer
    done;
}

if [[ $1 ]]; then
    ./packages/e2e-tests/run-single-test.sh $1
    exit $?
fi

if [[ `docker ps` =~ $CONTAINER_NAME ]]; then
        echo "A running node is detected. The end-to-end tests requires a fresh instance of a Blast node. Do you want to restart it?"
        select yn in "Yes" "No"; do
        case $yn in
            Yes ) echo 'stopping node...'; $compose down &> /dev/null && sleep 5; break;;
            No ) exit $?;;
        esac
        done
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
        file_name=${split[4]}
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

if [[ `docker ps` =~ $CONTAINER_NAME ]]; then
    echo 'Stopping the node...'
    $compose down &> /dev/null && sleep 5
fi

exit $exit_status