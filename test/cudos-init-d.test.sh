source ./test/_vars.test.sh

echo TEST cudos init -d
cudos init -d $INIT_FOLDER
cd $INIT_FOLDER
if [[ ! `ls -R` == $TEMPLATE_FILES ]]; then
    echo TEST cudos init -d FAILED
    echo "y" | rm -r ../$INIT_FOLDER
    exit 1
fi
echo TEST cudos init -d SUCCESS
rm -r ../$INIT_FOLDER
exit 0
# todo check TTY without -d