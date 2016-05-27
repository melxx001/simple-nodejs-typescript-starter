/* eslint strict:0 */
'use strict';

const ENV = process.env.NODE_ENV || 'development';

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
      level: process.env.DEBUG || 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    })],
  exitOnError: false,
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
