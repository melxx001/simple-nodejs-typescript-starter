#!/usr/bin/env bash

eval $NPM_CMD install


eval $NPM_CMD install -g typescript

echo Compiling typescript code
eval "node_modules/typescript/bin/tsc"
exitWithMessageOnError "tsc failed"

eval "npm run dev"


echo "Finished successfully."
