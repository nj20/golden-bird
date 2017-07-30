#!/bin/bash

#Getting this file's directory
dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd ${dir}

source ../config/${DEPLOYMENT_GROUP_NAME}.env

cd ..
npm install
PORT=${port} nohup npm start >log.out 2>log.err &
