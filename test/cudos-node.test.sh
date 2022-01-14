source ./test/_vars.test.sh

alias BLOCK_STATUS="$COMPOSE cudos-noded q block"

VALIDATE_STATUS() {
    echo 'TEST cudos node status'
    cd template
    RESULT=`cudos node status`
    if [[ ! $RESULT =~ "$1" ]]; then
        echo "TEST cudos node status FAILED\n\nEXPECTED: $1\n\nACTUAL: $RESULT" 1>&2
        cd ..
        exit 1
    fi
    echo 'TEST cudos node status SUCCESS'
    cd ..
}

echo 'TEST cudos node start'
cudos node start -d
# todo hide error msgs
EXPECTED='"height":'
sleep 45;
TIMER=30
until [[ `BLOCK_STATUS` =~ $EXPECTED ]]; do
    if (( $TIMER > 34 )); then
        echo "TEST cudos node start FAILED\n\nEXPECTED: BLOCK_STATUS to contain $EXPECTED" 1>&2
        exit 1
    fi
    sleep $TIMER;
    ((TIMER=TIMER+1))
done;
echo 'TEST cudos node start SUCCESS'

VALIDATE_STATUS 'online'

echo 'TEST cudos node stop'
cd template
cudos node stop
cd ..
TIMER=3
sleep $TIMER;
until [[ ! `docker ps` =~ $CONTAINER_NAME ]]; do
    if (( $TIMER > 10 )); then
        echo "TEST cudos node stop FAILED\n\nEXPECTED docker ps to not contain $CONTAINER_NAME" 1>&2
        exit 1
    fi
    sleep $TIMER
    ((TIMER=TIMER+1))
done;
echo 'TEST cudos node stop SUCCESS'
VALIDATE_STATUS "offline"
exit 0
