#!/bin/bash
#Used to start the server

#Getting this file's directory
dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd ${dir}

source ../config/${DEPLOYMENT_GROUP_NAME}.env

cd ..
npm install
forever start bin/www

