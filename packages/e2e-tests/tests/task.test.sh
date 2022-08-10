#!/bin/bash
source ./vars.sh
init_folder="$INIT_FOLDER-task-test"
exit_status=0

echo -n 'blast custom task...'
cp -R $PATH_TO_TEMPLATE $init_folder &> /dev/null
cd $init_folder

perl -pi -e 's/\/\* eslint-disable object-curly-newline \*\//require("cudos-blast\/utilities\/task")
task("test-task", "Running a test task").addParam("param", "Adding a custom param").setAction(function (argv) {
  console.log(argv.param)})/' blast.config.js

if [[ `blast test-task --param testParam` =~ 'testParam' ]]; then
    echo -e $PASSED
else
    echo -e $FAILED
    exit_status=1
fi

cd ..
rm -r -f $init_folder &> /dev/null || true
exit $exit_status
