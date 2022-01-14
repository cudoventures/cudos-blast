source ./test/_vars.test.sh

alias CLEANUP="cd .. && rm -r $INIT_FOLDER"

COMPARE_FILES() {
    if [[ ! `ls -R` == $TEMPLATE_FILES ]]; then
        echo "TEST $1 FAILED" 1>&2
        CLEANUP && exit 1
    fi
}

echo TEST cudos init -d
cudos init -d $INIT_FOLDER
cd $INIT_FOLDER
COMPARE_FILES 'cudos init -d'
CLEANUP
echo 'TEST cudos init -d SUCCESS'

echo TEST cudos init
mkdir $INIT_FOLDER
cd $INIT_FOLDER
cudos init
COMPARE_FILES 'cudos init'
echo 'TEST cudos init SUCCESS'
CLEANUP && exit 0