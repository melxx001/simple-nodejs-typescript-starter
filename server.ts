'use strict';

const nconf = require('nconf');

// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at './config.json'
nconf.argv().env().file({ file: './config.json' });

nconf.defaults({
  'NODE_ENV': 'development',
  'DEBUG': 'NodeExample:*',
  'PORT': 3000,

  // custom flags
  'appName': 'NodeExample',
  'logLevel': 'debug',
  'logInJson': false,
});

const ENV = nconf.get('NODE_ENV');
const PORT = nconf.get('PORT');
const LOG_LEVEL = nconf.get('logLevel');
const LOG_IN_JSON = nconf.get('logInJson');

// Can't use import here yet since harmony-modules
// Check out node --v8-options | grep harmony
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan'); // HTTP request logger middleware for node.js
const winston = require('winston'); // Logger

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: LOG_LEVEL,
      handleExceptions: true,
      json: LOG_IN_JSON,
      colorize: true,
    })],
  exitOnError: false,
});

const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

logger.info('Environment:', ENV);
if (ENV === 'development') {
  app.use(morgan('dev'));
}

// Start up the server.
app.listen(PORT, (err) => {
  if (err) {
    logger.error(err);
    return;
  }

  logger.info(`Listening on port ${PORT}`);
});
