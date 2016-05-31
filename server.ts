'use strict';

// Can't use import here yet since harmony-modules
// Check out node --v8-options | grep harmony
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan'); // HTTP request logger middleware for node.js
const winston = require('winston'); // Logger
const localization = require('i18n');
const path = require('path');
const nunjucks = require('nunjucks');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
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
  'lang': 'en-US'
});

// Environment variables
const ROOT = nconf.get('NODE_PATH');
const ENV = nconf.get('NODE_ENV');
const PORT = nconf.get('PORT');
const LOG_LEVEL = nconf.get('logLevel');
const LOG_IN_JSON = nconf.get('logInJson');

// Helper variables
const isDev = ENV === 'development';
const lang = nconf.get('lang');
const srcPath = `${ROOT}/src/`;
const views = path.join(srcPath, 'views');

// Logging Setup
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

// Express
const app = express();

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

// Configure localization
localization.configure({
  locales: ['en-US', 'es'],
  defaultLocale: 'en-US',
  cookie: 'lang',
  queryParameter: 'lang',
  directory: `${ROOT}/src/locales`,
  autoReload: isDev ? true : false,
  api: {
    '__': 't',  // now req.__ becomes req.t
    '__n': 'tn' // and req.__n can be called as req.tn
  }
});

// Middlewares
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(localization.init); // i18n init parses req for language headers, cookies, etc.
app.use(favicon(path.join(srcPath, 'public', 'favicon.ico')));
app.use(express.static(path.join(srcPath, 'public')));

if (isDev) {
  app.use(morgan('dev'));
}

// Pass translate functions to templates
app.use(function (req, res, next) {
  env.addGlobal('translate', req.t);
  env.addGlobal('plural_translate', req.tn);
  next();
});

// initial route
app.get('/', function(req, res) {
  res.render('index');
});

// catch 404 and forward to error handler
app.use((req, res) => {
  logger.debug('404 page not found');
  let err = new Error('Not Found');
  res.status(404);
  res.render('errors/404', {
    dev_message: err.message,
    error: err,
    show: isDev ? true : false,
  });
});

// development error handler
// will print stacktrace
app.use((err, req, res) => {
  res.status(err.status || 500);
  logger.error(err.stack);
  res.render('errors/error', {
    message: err.message ? err.message : 'No Message',
    error: err,
    show: isDev ? true : false,
  });
});

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

module.exports = app;
