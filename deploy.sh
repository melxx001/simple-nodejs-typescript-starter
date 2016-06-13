#!/usr/bin/env bash

if [ -e "$DEPLOYMENT_TARGET/package.json" ]; then
  cd "$DEPLOYMENT_TARGET"
  eval $NPM_CMD install --development
  exitWithMessageOnError "npm failed"
  cd - > /dev/null
fi

echo Compiling typescript code
npm compile
