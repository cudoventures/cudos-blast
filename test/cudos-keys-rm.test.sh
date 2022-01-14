echo 'TEST cudos keys rm'
cudos keys add test
cudos keys rm test -f
EXPECTED='name: test'
if [[ `cudos keys ls` =~ $EXPECTED ]]; then
    echo "TEST cudos keys rm FAILED\n\nEXPECTED cudos keys ls to not contain $EXPECTED" 1>&2
    exit 1
fi
echo 'TEST cudos keys rm SUCCESS'
exit 0
