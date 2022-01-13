source ./test/_vars.test.sh

echo TEST cudos init
mkdir $INIT_FOLDER
cd $INIT_FOLDER
cudos init
if [[ ! `ls -R` == $TEMPLATE_FILES ]]; then
    echo TEST cudos init FAILED
    rm -r ../$INIT_FOLDER
    exit 1
fi
echo TEST cudos init SUCCESS
rm -r ../$INIT_FOLDER
pwd
exit 0