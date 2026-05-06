#!/bin/bash

PROJECT_NAME=$1
BRANCH_NAME=$2
SSH_KEY_PATH=$3
HOST_USER=$4
HOST_IP=$5
HOST_PORT=${6:-"22"}

FILE_DESTINATION=/root/zettamerge/clever-platform/$PROJECT_NAME/2024-05-clever-platform-backoffice/v1/dist/
SSH_KEY_DIR=~/.ssh/zettamerge-server 

# Get the Git username
GIT_USERNAME=$(git config --global user.name)
# Get the PC hostname (fallback if Git username is not found)
PC_NAME=$(whoami)
# Choose the preferred name (Git username first, otherwise hostname)
DEPLOYER=${GIT_USERNAME:-$PC_NAME}
# Get the timestamp in "day/month/year-hh-mm-second" format
TIMESTAMP=$(date +"%d/%m/%Y-%H-%M-%S")
# Define the output file
DEPLOY_LOG_DESTINATION=/root/zettamerge/clever-platform/$PROJECT_NAME/2024-05-clever-platform-backoffice/v1/deployment-log
DEPLOY_LOG_FILENAME=$(date +"%d-%m-%Y__%H-%M-%S").log

git checkout $BRANCH_NAME || { echo: "switch branch failed"; exit 1; }
git pull || { echo: "git pull failed"; exit 1; }

# Install dependencies
npm install --legacy-peer-deps || { echo "install package failed"; exit 1; }

# Run build command
npm run build || { echo "Build failed"; exit 1; }

# Copy files via SCP
scp -P "$HOST_PORT" -i "$SSH_KEY_DIR" -r ./dist/. "$HOST_USER@$HOST_IP:$FILE_DESTINATION" || { echo "SCP failed"; exit 1; }
# maybe use tar. faster when have multiple smaller file I think
# tar  --no-xattrs -cf - ./dist | ssh -i $SSH_KEY_PATH $HOST_USER@$HOST_IP -p $HOST_PORT "tar -xf - -C $FILE_DESTINATION "


# Restart Nginx and log deployment remotely
ssh -i $SSH_KEY_PATH $HOST_USER@$HOST_IP -p $HOST_PORT << EOF
systemctl restart nginx
mkdir -p $DEPLOY_LOG_DESTINATION && echo "$DEPLOYER-$TIMESTAMP" >> $DEPLOY_LOG_DESTINATION/$DEPLOY_LOG_FILENAME
echo "deploy log store at $DEPLOY_LOG_DESTINATION/$DEPLOY_LOG_FILENAME"
EOF
echo "Deploy '$1' Success"