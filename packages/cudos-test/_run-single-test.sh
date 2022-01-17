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

if [[ ! `ls -a ./packages/cudos-test` =~ $1 ]]; then
    echo 'Invalid test file!'
    exit 1
fi

if [[ $1 == 'node-start.test.sh' ]]; then
    if [[ `docker ps` =~ $CONTAINER_NAME ]]; then
        echo 'Node is started. Your node will be stopped and started again after the test is executed.'
        $compose down &> /dev/null && sleep 5;
        node_stopped=true
    fi
    ./packages/cudos-test/$1
    exit_status=$?
    if [[ node_stopped == true ]]; then
        echo 'Getting your node back up...'
        start_node
    fi
    exit $exit_status
fi

if [[ ! `docker ps` =~ $CONTAINER_NAME && ($1 =~ 'keys' || $1 =~ 'node-stop') ]]; then
    echo 'Node is not started. Your will be started and stopped after the test is executed.'
    start_node
    node_started=true
fi

./packages/cudos-test/$1
exit_status=$?

if [[ $node_started == true && `docker ps` =~ $CONTAINER_NAME ]]; then
    echo 'Stopping the node...'
    $compose down &> /dev/null && sleep 5;
fi
exit $exit_status