source ./test/_vars.test.sh

echo TEST cudos node stop
cd template
cudos node stop
TIMER=3
until [[ ! `docker ps` =~ $CONTAINER_NAME ]]; do
    if (( $TIMER > 15 )); then
        echo TEST cudos node stop FAILED
        exit 1
    fi
    sleep $TIMER
    ((TIMER=TIMER+1))
done;
echo TEST cudos node stop SUCCESS
exit 0
