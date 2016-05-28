'use strict';

const nconf = require('nconf');

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

const isDev = ENV === 'development';

// Can't use import here yet since harmony-modules
// Check out node --v8-options | grep harmony
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan'); // HTTP request logger middleware for node.js
const winston = require('winston'); // Logger
const i18next = require('i18next');
const middleware = require('i18next-express-middleware');

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
const path = require('path');
const srcPath = `${ROOT}/src/`;
const views = path.join(srcPath, 'views');
const swig = require('swig');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');

// view engine setup
app.engine('swig', swig.renderFile);
app.set('views', views);
app.set('view engine', 'swig');

swig.setDefaults({
  loader: swig.loaders.fs(views),
  cache: (isDev) ? false : true,
});

// Middlewares
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
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
    console.error(bind + ' requires elevated privileges');
    process.exit(1);
    break;
  case 'EADDRINUSE':
    console.error(bind + ' is already in use');
    process.exit(1);
    break;
  default:
    throw error;
  }
});

// Process uncaught exsception
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
    show: true,
  });
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('errors/error', {
      message: err.message,
      error: err,
      show: true,
    });
  });
} else {
  // production error handler
  // no stacktraces leaked to user
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('errors/error', {
      message: err.message,
      error: {},
      show: false,
    });
  });
}

module.exports = app;
