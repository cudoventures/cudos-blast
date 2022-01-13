echo cudos compile TEST

cd test-cudos-init
cudos compile
cd artifacts

EXPECTED="alpha.wasm
beta.wasm
checksums.txt
checksums_intermediate.txt"
RESULT=$(ls -R)
if [[ ! "$RESULT" == $EXPECTED ]]; then
    echo cudos compile FAILED
    exit 1
fi
echo cudos compile SUCCESS