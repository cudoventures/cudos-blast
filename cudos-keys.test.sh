echo cudos keys TEST

cudos keys add test

EXPECTED="name: test"
RESULT=$(cudos keys ls)
if [[ ! "$RESULT" =~ $EXPECTED ]]; then
    echo cudos keys add FAILED
    exit 1
fi

# todo test funding 
#docker exec -ti cudos-config_cudos-node_1 /bin/bash

EXPECTED='amount: "1000000000000000000"'
RESULT=$(echo exit | echo cudos-noded q bank balances $(cudos-noded keys show test -a) | docker exec -ti cudos-config_cudos-node_1 /bin/bash)
if [[ ! "$RESULT" =~ $EXPECTED ]]; then
    echo cudos keys fund FAILED
    exit 1
fi

echo "y" | cudos keys rm test

EXPECTED="name: test"
RESULT=$(cudos keys ls)
if [[ "$RESULT" =~ $EXPECTED ]]; then
    echo cudos keys rm FAILED
    exit 1
fi
echo cudos keys SUCCESS§