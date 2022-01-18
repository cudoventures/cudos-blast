source ./packages/cudos-test/_vars.sh
alias block_status="$COMPOSE cudos-noded q block"

echo "Running cudos node start..."
cudos node start -d &> /dev/null
sleep 45;
timer=30
until [[ `block_status` =~ $VALID_BLOCK_STATUS ]]; do
    if (( $timer > 34 )); then
        echo "cudos node start $FAILED\nNode was not started successfuly!\n'cudos noded q block' does not contain height!" 1>&2
        exit 1
    fi
    sleep $timer;
    ((timer=timer+1))
done;
echo "cudos node start $PASSED"

echo "Running cudos node status..."
cd template
if [[ ! `cudos node status` =~ 'online' ]]; then
    echo "cudos node status $FAILED"
    exit 1
fi
echo "cudos node status $PASSED"
