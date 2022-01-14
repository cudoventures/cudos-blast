# source ./test/_vars.test.sh

# echo TEST cudos compile
# cudos init -d $INIT_FOLDER
# cd $INIT_FOLDER
# cudos compile
# cd artifacts
# if [[ ! `ls -R` == $COMPILE_FILES ]]; then
#     rm -r ../../$INIT_FOLDER && rm -r ../../cudos-data
#     echo 'TEST cudos compile FAILED' 1>&2
#     exit 1
# fi
# #rm: ../../cudos-data: No such file or directory
# pwd
# rm -r ../../$INIT_FOLDER && rm -r ../../cudos-data
# echo 'TEST cudos compile SUCCESS'
# exit 0

source ./test/_vars.test.sh

alias CLEANUP="rm -r ../../$INIT_FOLDER"

echo TEST cudos compile
cudos init -d $INIT_FOLDER
cd $INIT_FOLDER
cudos compile
cd artifacts
if [[ ! `ls -R` == $COMPILE_FILES ]]; then
    echo 'TEST cudos compile FAILED' 1>&2
    CLEANUP && exit 1
fi
echo 'TEST cudos compile SUCCESS'
CLEANUP && exit 0