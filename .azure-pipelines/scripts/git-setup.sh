#!/bin/bash
set -e

# Extract branch name
FULL_BRANCH_NAME=$BUILD_SOURCEBRANCH
BRANCH_NAME=${FULL_BRANCH_NAME##refs/heads/}
echo "Branch name extracted: $BRANCH_NAME"

# Configure Git authentication
echo "Configuring Git authentication..."
git config --global user.email "$GIT_USER_EMAIL"
git config --global user.name "$GIT_USER_NAME"
git remote set-url origin https://$SYSTEM_ACCESSTOKEN@dev.azure.com/exxat-team/Exxat-UI/_git/Exxat-UI

# Fetch the branch from remote
git fetch origin "$BRANCH_NAME"
if [ $? -ne 0 ]; then
  echo "Branch $BRANCH_NAME does not exist on the remote. Skipping checkout."
  exit 1
fi


# Export the branch name so other scripts can use it
export BRANCH_NAME