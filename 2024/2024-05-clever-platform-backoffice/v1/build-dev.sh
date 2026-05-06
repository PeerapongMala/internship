#!/bin/bash

SSH_KEY_PATH=$1
HOST_USER=$2
HOST_IP=$3
HOST_PORT=$4

# ./build.sh <folder-name> <branch-name>
./build.sh "development" "main" $SSH_KEY_PATH $HOST_USER $HOST_IP $HOST_PORT