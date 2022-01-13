echo TEST cudos node stop

cd template
cudos node stop

CONTAINER_NAME='cudos-config_cudos-node'
RESULT="docker ps"
# todo iterate TIMER
# todo research [] vs [[]]
TIMER=3
until [[ ! `docker ps` =~ 'cudos-config_cudos-node' ]]; do
    if (( $TIMER > 15 )); then
        echo FAILED cudos node stop
        exit 1
    fi
    sleep $TIMER;
    ((TIMER=TIMER+1))
done;
echo SUCCESS cudos node stop
exit 0

# EXPECTED="cudos-config_cudos-node"
# # todo cudos node start never stops printing so the script never moves forward
# RESULT=$(docker ps --filter "status=running")
# if [[ ! "$RESULT" =~ $EXPECTED ]]; then
#     echo cudos node start FAILED
#     exit 1
# fi
# todo test funding 

# cudos node stop

# RESULT=$(docker ps --filter "status=exited")
# if [[ ! "$RESULT" =~ $EXPECTED ]]; then
#     echo cudos node stop FAILED
#     exit 1
# fi
# echo cudos node SUCCESS