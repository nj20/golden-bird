#!/bin/bash

#Getting this file's directory
dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd ${dir}

#waits until the API is ready
while [[ $(curl -s 'localhost/api/') != *'"available":true'* ]]
do
    :
done

cd ..
newman run test/postman_collection.json


