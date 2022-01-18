source ./packages/cudos-test/_vars.sh

echo "Running cudos node stop..."
cd template
cudos node stop &> /dev/null
TIMER=3
sleep $TIMER;
until [[ ! `docker ps` =~ $CONTAINER_NAME ]]; do
    if (( $TIMER > 5 )); then
        echo "cudos node stop $FAILED\nNode was not stopped successfuly!\n'docker ps' should not contain $CONTAINER_NAME" 1>&2
        exit 1
    fi
    sleep $TIMER
    ((TIMER=TIMER+1))
done;
echo "cudos node stop $PASSED"

echo "Running cudos node status..."
if [[ ! `cudos node status` =~ 'offline' ]]; then
    echo "cudos node status $FAILED"
    exit 1
fi
echo "cudos node status $PASSED"