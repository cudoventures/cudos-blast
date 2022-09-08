#!/bin/bash
source ./vars.sh
init_folder="$INIT_FOLDER-verify"
exit_status=0

echo -n 'blast custom task...'
cp -R $PATH_TO_TEMPLATE $init_folder &> /dev/null

cd $PATH_TO_BLAST_VERIFY
npm link &> /dev/null

cd $e2e_dir
cd $init_folder
#sync command with doc
npm link @cudos/blast-verify &> /dev/null

perl -pi -e 's|module.exports.config = {|require("\@cudos/blast-verify")
module.exports.config = {
    verify: {
        network: "private_testnet"
    },|' blast.config.js

if [[ `blast verify --address=cudos1gurgpv8savnfw66lckwzn4zk7fp394lpe667dhu7aw48u40lj6jsyn77ws --label=alpha` =~ 'parsed successfully' ]]; then
    echo -e $PASSED
else
    echo -e $FAILED
    exit_status=1
fi

cd $e2e_dir
rm -r -f $init_folder &> /dev/null || true
exit $exit_status
