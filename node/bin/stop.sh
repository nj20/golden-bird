#!/bin/bash

#Getting this file's directory
dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd ${dir}

source ../config/${DEPLOYMENT_GROUP_NAME}.env

if [[ -z $(lsof -i:${port} -t) ]]
    then
        echo "Server is not listening on port" ${port}
    else
        kill -9 $(lsof -i:${port} -t)
fi