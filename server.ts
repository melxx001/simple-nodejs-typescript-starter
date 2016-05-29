'use strict';

// Can't use import here yet since harmony-modules
// Check out node --v8-options | grep harmony
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan'); // HTTP request logger middleware for node.js
const winston = require('winston'); // Logger
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-express-middleware');
const path = require('path');
const nunjucks = require('nunjucks');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const nconf = require('nconf');

import * as utils from './src/utils/utils';

// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at './config.json'
nconf.argv().env().file({ file: './config.json' });

nconf.defaults({
  'NODE_ENV': 'development',
  'NODE_PATH': '.',
  'DEBUG': 'NodeExample:*',
  'PORT': 3000,

  // custom flags
  'appName': 'NodeExample',
  'logLevel': 'debug',
  'logInJson': false,
});

// Environment variables
const ROOT = nconf.get('NODE_PATH');
const ENV = nconf.get('NODE_ENV');
const PORT = nconf.get('PORT');
const LOG_LEVEL = nconf.get('logLevel');
const LOG_IN_JSON = nconf.get('logInJson');

// Helper variables
const isDev = ENV === 'development';

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

const srcPath = `${ROOT}/src/`;
const views = path.join(srcPath, 'views');
const app = express();

i18next.init({
  lng: 'en-US',
  fallbackLng: 'en',
}); // init localization
// i18n.registerAppHelper(app); // translate inside template using t function

// view engine setup
app.engine('njk', nunjucks.render);
app.set('views', views);
app.set('view engine', 'njk');

const env = nunjucks.configure(views, {
  autoescape: true,
  watch: isDev ? true : false,
  noCache: isDev ? true : false,
  express: app,
});

// Add filters that can be used in templates
env.addFilter('i18n', utils.translate);

// Middlewares
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(i18nextMiddleware.handle(i18next));
app.use(favicon(path.join(srcPath, 'public', 'favicon.ico')));
app.use(express.static(path.join(srcPath, 'public')));

if (isDev) {
  app.use(morgan('dev'));
}

// Start up the server.
app.listen(PORT, (err) => {
  if (err) {
    logger.error(err);
    return;
  }

  logger.info('Environment:', ENV);
  logger.info(`Listening on port ${PORT}`);
});

app.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
  case 'EACCES':
    logger.error(bind + ' requires elevated privileges');
    process.exit(1);
    break;
  case 'EADDRINUSE':
    logger.error(bind + ' is already in use');
    process.exit(1);
    break;
  default:
    throw error;
  }
});

// Process uncaught exception
process.on('uncaughtException', function(err) {
  logger.error((new Date).toUTCString() + ' uncaughtException:', err.message);
  logger.error(err.stack);
});

// initial route
app.get('/', function(req, res) {
    res.render('index', {
      title: 'Index Page'
    });
});

// catch 404 and forward to error handler
app.use((req, res) => {
  let err = new Error('Not Found');
  res.status(404);
  res.render('errors/404', {
    message: err.message,
    error: err,
    show: isDev ? true : false,
  });
});

// development error handler
// will print stacktrace
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('errors/error', {
    message: err.message ? err.message : 'Ooops... Something went wrong. We\'re fixing it',
    error: err,
    show: isDev ? true : false,
  });
});

module.exports = app;
