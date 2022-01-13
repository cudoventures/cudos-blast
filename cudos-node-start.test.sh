# echo cudos node TEST

# cudos node start -d

# timer=1
# until [ "`docker inspect -f {{.State.Running}} cudos-config_cudos-node_1`"=="asdasds" ]; do
#     sleep $timer;
    
#     ((timer=timer+1))
#     echo $timer

#     if (( $timer > 10 )); then
#         echo cudos node start FAILED
#         exit 1
#     fi
# done;
# echo cudos node start SUCCESS

echo TEST cudos node start

cudos node start -d

EXPECTED='\"height\":'
BLOCK_STATUS="docker compose -f ./packages/cudos-config/docker-compose-start.yaml -f ./packages/cudos-config/docker-compose-init.yaml exec cudos-node cudos-noded q block"
TIMER=5
until [[ `$BLOCK_STATUS` =~ '\"height\":' ]]; do
    if (( $TIMER > 15 )); then
        echo FAILED cudos node start
        exit 1
    fi
    sleep $TIMER;
    ((TIMER=TIMER+1))
    
done;
echo SUCCESS cudos node start
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