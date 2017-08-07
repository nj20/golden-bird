#!/bin/bash
# This script is for LINUX operating system
# It installs all dependencies needed to run the server
apt-get update
apt-get install -y nodejs-legacy
apt-get install -y npm
npm install -g newman
npm install forever -g