alias CLEANUP='cudos keys rm test -f'

echo 'TEST cudos keys add'
cudos keys add test
EXPECTED='name: test'
if [[ ! `cudos keys ls` =~ $EXPECTED ]]; then
    echo "TEST cudos keys add FAILED\n\nEXPECTED cudos keys ls to contain $EXPECTED" 1>&2
    CLEANUP && exit 1
fi
echo 'TEST cudos keys add SUCCESS'
CLEANUP && exit 0
