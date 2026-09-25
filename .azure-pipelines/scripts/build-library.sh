#!/bin/bash
set -e

# Load Git setup
source $(dirname "$0")/git-setup.sh

git reset --hard origin/$BRANCH_NAME
cat package.json

echo "Starting the build process..."
rm -rf dist
mkdir -p dist
npm run build
echo "Build process completed. Directory contents:"
ls -al dist || echo "Dist folder not found"

echo "//pkgs.dev.azure.com/exxat-team/_packaging/V4/npm/registry/:_authToken=$SYSTEM_ACCESSTOKEN" > ~/.npmrc
cat ~/.npmrc
cp .npmrc dist/.npmrc
cat dist/.npmrc || echo ".npmrc file not found!"

NPM_TAG="main"
if [ "$BRANCH_NAME" == "dev" ]; then
  NPM_TAG="beta"
fi

echo "Publishing with tag: $NPM_TAG"
cd dist
npm publish --userconfig ~/.npmrc --access public --tag "$NPM_TAG" || echo "NPM publish failed!"
