echo TEST cudos keys add
cudos keys add test

if [[ ! `cudos keys ls` =~ 'name: test' ]]; then
    echo TEST cudos keys add FAILED
    cudos keys rm test -f
    exit 1
fi
echo TEST cudos keys add SUCCESS
cudos keys rm test -f
exit 0
