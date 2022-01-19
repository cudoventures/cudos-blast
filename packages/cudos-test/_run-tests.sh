source ./packages/cudos-test/_vars.sh
alias block_status='$COMPOSE cudos-noded q block'
compose='docker compose -f ./packages/cudos-config/docker-compose-start.yaml -f ./packages/cudos-config/docker-compose-init.yaml'
start_node() {
    $compose up --build -d &> /dev/null
    timer=45
    sleep $timer;
    until [[ `block_status` =~ $VALID_BLOCK_STATUS ]]; do
        sleep $timer;
    done;
}

if [[ $1 ]]; then
    ./packages/cudos-test/_run-single-test.sh $1
    exit $?
fi

if [[ `docker ps` =~ $CONTAINER_NAME ]]; then
    echo 'Node is started. Your node will be stopped and started again after the tests are executed.'
    $compose down &> /dev/null && sleep 5;
    node_stopped=true
fi

echo "Executing node-start-status.test.sh"
./packages/cudos-test/node-start-status.test.sh
if [[ $? == 1 ]]; then
    exit_status=1
fi
if [[ ! `docker ps` =~ $CONTAINER_NAME ]]; then
    start_node
fi

for test in ./packages/cudos-test/*.test.sh; do
    if [[ ! $test =~ 'node' ]]; then
        split=(${test//// })
        file_name=${split[3]}
        echo "Executing $file_name"
        $test
        if [[ $? == 1 ]]; then
            exit_status=1
        fi
    fi
done

echo "Executing node-stop-status.test.sh"
./packages/cudos-test/node-stop-status.test.sh
if [[ $? == 1 ]]; then
    exit_status=1
fi
if [[ $node_stopped == false && `docker ps` =~ $CONTAINER_NAME ]]; then
    $compose down &> /dev/null && sleep 5;
fi

if [[ $node_stopped == true && ! `docker ps` =~ $CONTAINER_NAME ]]; then
    echo 'Getting your node back up...'
    start_node
fi
exit $exit_status