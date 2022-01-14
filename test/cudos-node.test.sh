source ./test/_vars.test.sh

alias BLOCK_STATUS="$COMPOSE cudos-noded q block"

VALIDATE_STATUS() {
    pwd
    cd template
    if [[ ! `cudos node status` =~ "$1" ]]; then
        echo 'TEST cudos node status FAILED' 1>&2
        cd ..
        exit 1
    fi
    echo 'TEST cudos node status SUCCESS'
    cd ..
}

echo TEST cudos node start
cudos node start -d
TIMER=30
sleep $TIMER;
# todo hide error msgs
until [[ `BLOCK_STATUS` =~ '"height":' ]]; do
    if (( $TIMER > 34 )); then
        echo 'TEST cudos node start FAILED' 1>&2
        exit 1
    fi
    sleep $TIMER;
    ((TIMER=TIMER+1))
done;
echo 'TEST cudos node start SUCCESS'

VALIDATE_STATUS 'online'

echo TEST cudos node stop
cd template
cudos node stop
cd ..
TIMER=3
sleep $TIMER;
until [[ ! `docker ps` =~ $CONTAINER_NAME ]]; do
    if (( $TIMER > 10 )); then
        echo 'TEST cudos node stop FAILED' 1>&2
        exit 1
    fi
    sleep $TIMER
    ((TIMER=TIMER+1))
done;
echo 'TEST cudos node stop SUCCESS'
VALIDATE_STATUS "offline"
exit 0
