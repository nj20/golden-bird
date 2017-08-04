#!/bin/bash
#Used to start the server
# add -w flag while developing. This will watch for file changes and update ther server

getopts ":w" opt

#Getting this file's directory
dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd ${dir}

source ../config/${DEPLOYMENT_GROUP_NAME}.env

cd ..
npm install

if [[ $opt == "?" ]]
then
    forever start bin/www
else
    forever start -w bin/www
fi
