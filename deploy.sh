#!/usr/bin/env bash

eval "npm install"


eval "npm install -g typescript"

echo Compiling typescript code
eval "node_modules/typescript/bin/tsc"
exitWithMessageOnError "tsc failed"

eval "npm run dev"


echo "Finished successfully."
