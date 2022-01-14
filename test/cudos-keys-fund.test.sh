source ./test/_vars.test.sh

echo TEST cudos keys fund
cudos keys add test
cudos keys fund test -t 1
BALANCE="$COMPOSE cudos-noded q bank balances $($COMPOSE cudos-noded keys show test -a)"
if [[ ! `$BALANCE` =~ 'amount: "1000000000000000001"' ]]; then
    cudos keys rm test -f
    echo 'TEST cudos keys fund FAILED' 1>&2
    exit 1
fi
cudos keys rm test -f
echo 'TEST cudos keys fund SUCCESS'
exit 0