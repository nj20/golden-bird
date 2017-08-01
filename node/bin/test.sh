#!/bin/bash

#Getting this file's directory
dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd ${dir}
cd ..

source ./config/${DEPLOYMENT_GROUP_NAME}.env

#Running integration tests
./node_modules/mocha/bin/mocha --recursive

#waits until the API is ready
while [[ $(curl -s 'localhost/api/') != *'"available":true'* ]]
do
    :
done

#Running acceptance tests
newman run test/postmanAcceptance.json


