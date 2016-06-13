#!/usr/bin/env bash

if [ -e "$DEPLOYMENT_TARGET/package.json" ]; then
  cd "$DEPLOYMENT_TARGET"
  eval $NPM_CMD install --development

  exitWithMessageOnError "npm failed"
  cd - > /dev/null
fi

$NPM_CMD install -g typescript
$NPM_CMD install -g typings

echo Installing typings
eval "node_modules/.bin/typings" install
exitWithMessageOnError "typings failed"

echo Compiling typescript code
eval "node_modules/.bin/tsc"
exitWithMessageOnError "tsc failed"
