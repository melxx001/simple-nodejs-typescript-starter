#!/usr/bin/env bash

if [ -e "$DEPLOYMENT_TARGET/package.json" ]; then
  cd "$DEPLOYMENT_TARGET"
  $NPM_CMD install -g typescript
  $NPM_CMD install -g typings

  eval $NPM_CMD install --development
  typings install

  exitWithMessageOnError "npm failed"
  cd - > /dev/null

  echo Compiling typescript code
  tsc
fi

