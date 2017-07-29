#!/bin/bash

#Getting this file's directory
dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd ${dir}

#Parsing command line arguments
while [[ $# -gt 1 ]]
    do
        key="$1"
        case $key in
            -e|--environment)
            environment="$2"
            shift # past argument
            ;;
        esac
        shift # past argument or value
    done

if [[ -z ${environment} ]]
    then
        echo "Enter environment by -e"
        exit 1
fi

source ../config/${environment}.env

cd ..
npm install
PORT=${port} npm start