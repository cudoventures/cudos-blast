source ./test/_vars.test.sh

alias GET_BALANCE='$COMPOSE cudos-noded q bank balances $($COMPOSE cudos-noded keys show test -a)'
alias CLEANUP='cudos keys rm test -f'

echo 'TEST cudos keys fund'
cudos keys add test
cudos keys fund test -t 1
RESULT=`GET_BALANCE`
EXPECTED='amount: "1000000000000000001"'
if [[ ! $RESULT =~ $EXPECTED ]]; then
    echo "TEST cudos keys fund FAILED\n\nEXPECTED: $EXPECTED\n\nACTUAL: $RESULT" 1>&2
    CLEANUP && exit 1
fi
echo 'TEST cudos keys fund SUCCESS'
CLEANUP && exit 0