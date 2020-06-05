#!/bin/bash

echo "Creating new version"

current_commit="$(git rev-parse --short HEAD)";

npm version prerelease -preid "${current_commit}" -no-git-tag-version