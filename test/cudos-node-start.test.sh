source ./test/_vars.test.sh

echo TEST cudos node start
cudos node start -d
TIMER=5
# todo hide error msgs
until [[ `$BLOCK_STATUS` =~ '"height":' ]]; do
    if (( $TIMER > 15 )); then
        echo TEST cudos node start FAILED
        exit 1
    fi
    sleep $TIMER;
    ((TIMER=TIMER+1))
done;
echo TEST cudos node start SUCCESS
exit 0