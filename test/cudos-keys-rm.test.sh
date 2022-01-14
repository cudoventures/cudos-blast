echo TEST cudos keys rm
cudos keys add test
cudos keys rm test -f
if [[ `cudos keys ls` =~ 'name: test' ]]; then
    echo 'TEST cudos keys rm FAILED' 1>&2
    exit 1
fi
echo 'TEST cudos keys rm SUCCESS'
exit 0
