source ./test/_vars.test.sh

echo cudos test TEST
cd test-cudos-init
EXPECTED="run tests
run test:  alpha.test.js"
RESULT=$(cudos test)
if [[ ! "$RESULT" == $EXPECTED ]]; then
    echo cudos test FAILED
    exit 1
fi
echo cudos test S