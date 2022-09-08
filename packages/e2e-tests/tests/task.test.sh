#!/bin/bash
source ./vars.sh
init_folder="$INIT_FOLDER-task"
exit_status=0

echo -n 'blast custom task...'
cp -R $PATH_TO_TEMPLATE $init_folder &> /dev/null
cd $init_folder

perl -pi -e 's|module.exports|require("cudos-blast/utilities/task")
task("test-task", "Running a test task")
  .addParam("param1", "Adding the first custom param")
  .addParam("param2", "Adding a second custom param", "p2", "boolean", false, false)
  .setAction((argv) => {
    if (argv.param2) {
      console.log("HELLO!")
      return
    }
    console.log(argv.param1)
  })
module.exports|' blast.config.js

if [[ ! `blast test-task --param1 testParam` =~ 'testParam' ]]; then
    exit_status=1
fi

if [[ $exit_status != 1 ]] && [[ `blast test-task --param1 testParam --p2` =~ 'HELLO!' ]]; then
    echo -e $PASSED
else
    echo -e $FAILED
    exit_status=1
fi

cd ..
rm -r -f $init_folder &> /dev/null || true
exit $exit_status
