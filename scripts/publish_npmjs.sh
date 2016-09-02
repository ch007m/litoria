#!/usr/bin/env bash

echo "Publish to npmjs.org the module"
npm publish

echo ">> Increase the package version for the next release"
npm version patch