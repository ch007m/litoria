#!/usr/bin/env bash

echo ">> Checkout the release branch & tag it"
PACKAGE_VERSION=$(grep -m1 version package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g')
echo ">> Version : $PACKAGE_VERSION"

echo ">> Checkout release branch & tag it"
git checkout release
git tag -a 'v'$PACKAGE_VERSION -m 'Release of Litoria $PACKAGE_VERSION'
git push origin 'v'$PACKAGE_VERSION

git checkout master
