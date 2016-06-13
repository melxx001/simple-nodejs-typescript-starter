#!/usr/bin/env bash

SCRIPT_DIR="${BASH_SOURCE[0]%\\*}"
SCRIPT_DIR="${SCRIPT_DIR%/*}"
ARTIFACTS=$SCRIPT_DIR/../artifacts
DEPLOYMENT_TARGET=$ARTIFACTS/wwwroot

  cd "$DEPLOYMENT_TARGET"
  eval $NPM_CMD install


  eval $NPM_CMD install -g typescript

  echo Compiling typescript code
  eval "node_modules/typescript/bin/tsc"
  exitWithMessageOnError "tsc failed"

  eval "npm run dev"


echo "Finished successfully."
