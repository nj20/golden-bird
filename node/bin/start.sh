#!/bin/bash
# This script works on MAC and LINUX
# Used to start the server

#Getting this file's directory
dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd ${dir}

source ../config/${DEPLOYMENT_GROUP_NAME}.env

cd ..
npm install
forever start --spinSleepTime 60000 --minUptime 1000 bin/www

