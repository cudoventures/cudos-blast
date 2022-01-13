echo TEST cudos keys rm
cudos keys add test
echo "y" | cudos keys rm test
if [[ `cudos keys ls` =~ 'name: test' ]]; then
    echo TEST cudos keys rm FAILED
    exit 1
fi
echo TEST cudos keys rm SUCCESS
exit 0
