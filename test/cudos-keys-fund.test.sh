echo TEST cudos keys fund
cudos keys add test
cudos keys fund test -t 1
COMPOSE='docker compose -f ./packages/cudos-config/docker-compose-start.yaml -f ./packages/cudos-config/docker-compose-init.yaml exec cudos-node'
TEST_ADDRESS=`$COMPOSE cudos-noded keys show test -a`
BALANCE="$COMPOSE cudos-noded q bank balances $($COMPOSE cudos-noded keys show test -a)"
if [[ ! `$BALANCE` =~ 'amount: "1000000000000000001"' ]]; then
    echo TEST cudos keys fund FAILED
    cudos keys rm test -f
    exit 1
fi
echo TEST cudos keys fund SUCCESS
cudos keys rm test -f
exit 0
# echo TEST cudos keys rm
# cudos keys rm test
# if [[ `cudos keys ls` =~ 'name: test' ]]; then
#     echo TEST cudos keys rm FAILED
#     exit 1
# fi
# echo TEST udos keys rm SUCCESS

# exit 0
# todo remove cudos-data folder and test acc
# todo test fund command and split tests into seperate files