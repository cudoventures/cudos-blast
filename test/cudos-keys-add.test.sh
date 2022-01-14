echo TEST cudos keys add
cudos keys add test

if [[ ! `cudos keys ls` =~ 'name: test' ]]; then
    cudos keys rm test -f
    echo 'TEST cudos keys add FAILED' 1>&2
    exit 1
fi
cudos keys rm test -f
echo 'TEST cudos keys add SUCCESS'
exit 0
