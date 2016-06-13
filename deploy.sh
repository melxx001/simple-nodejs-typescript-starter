#!/usr/bin/env bash

SCRIPT_DIR="${BASH_SOURCE[0]%\\*}"
SCRIPT_DIR="${SCRIPT_DIR%/*}"
ARTIFACTS=$SCRIPT_DIR/../artifacts
DEPLOYMENT_TARGET=$ARTIFACTS/wwwroot

if [ -e "$DEPLOYMENT_TARGET/package.json" ]; then
  cd "$DEPLOYMENT_TARGET"
  eval $NPM_CMD install --development

  exitWithMessageOnError "npm failed"
  cd - > /dev/null
fi



  $NPM_CMD install -g typescript
  $NPM_CMD install -g typings

  echo Installing typings
  typings install
  exitWithMessageOnError "typings failed"

  echo Compiling typescript code
  tsc
  exitWithMessageOnError "tsc failed"

  $NPM_CMD run dev


echo "Finished successfully."
