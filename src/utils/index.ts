'use strict';

import * as winston from 'winston';
import * as nconf from 'nconf';

const logLevel = nconf.get('logLevel');
const logInJson = nconf.get('logInJson');

// Logging Setup
const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: logLevel,
      handleExceptions: true,
      json: logInJson,
      colorize: true,
    })],
  exitOnError: false,
});


// Set debug module with appname from configuration
const dbg = (name) => {
  const appName = nconf.get('appName');
  return require('debug')(`${appName}:${name}`);
};

const debug = dbg('utils');
debug('logLevel', logLevel);
debug('logInJson', logInJson);

export {
  logger as Logger,
  dbg as Debug
};

