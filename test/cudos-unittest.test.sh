source ./test/_vars.test.sh

echo cudos unittest TEST
cd test-cudos-init
#todo parameterize number of tests
EXPECTED="test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out"
RESULT=$(cudos unittest)
if [[ ! "$RESULT" =~ $EXPECTED ]]; then
    echo cudos unittest FAILED
    exit 1
fi
echo cudos unittest SUCCESS