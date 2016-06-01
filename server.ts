'use strict';

// Can't use import here yet since harmony-modules
// Check out node --v8-options | grep harmony
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan'); // HTTP request Logger middleware for node.js
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
  NODE_ENV: 'development',
  NODE_PATH: '.',
  PORT: 3000,

  // DB Data (MySQL)
  dbHost: 'localhost',
  dbName: 'dev',
  dbUser: 'root',
  dbPassword: 'root',
  dbDialect: 'mysql',
  dbPool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  // custom flags
  appName: 'NodeExample',
  logLevel: 'warn',
  logInJson: false,
  lang: 'en-US'
});

// Environment variables
const ROOT = nconf.get('NODE_PATH');
const ENV = nconf.get('NODE_ENV');
const PORT = nconf.get('PORT');

// Helper variables
const isDev = ENV === 'development';
const lang = nconf.get('lang');
const srcPath = `${ROOT}/src/`;
const views = path.join(srcPath, 'views');
const { Logger, LoggerMiddleware, Debug } = require('./src/utils');

// Set debug function
const debug = Debug('server');

debug('isDev', isDev);
debug('srcPath', srcPath);
debug('Views path', views);

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

// Setup Middlewares
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

// Pass translation function to templates
app.use(function (req, res, next) {
  debug('Passing translation functions to templates');
  env.addGlobal('translate', req.t);
  env.addGlobal('pluralTranslate', req.tn);
  next();
});

// Add the logger middleware so we can capture data automatically
app.use(LoggerMiddleware(Logger));

// Routes
app.use(require('./src/routes'));

// catch 404 and forward to error handler
app.use((req, res) => {
  Logger.info('404 page not found');
  let err = new Error('Not Found');
  let data = {
    dev_message: err.message,
    stack: err.stack,
    show: isDev ? true : false,
  };
  let status = 404;

  res.status(status);
  res.render('errors/404', data);

  debug('%s params %s', status, JSON.stringify(data));
});

// development error handler
// will print stacktrace
app.use((err, req, res) => {
  let data = {
    message: err.message ? err.message : 'No Message',
    stack: err.stack,
    show: isDev ? true : false,
  };

  let status = err.status || 500;

  res.status(status);
  Logger.error(err.stack);
  res.render('errors/error', data);

  debug('%s params %s', status, JSON.stringify(data));
});

// Start up the server
app.listen(PORT, (err) => {
  if (err) {
    Logger.error(err);
    return;
  }

  Logger.info('Environment:', ENV);
  Logger.info(`Listening on port ${PORT}`);

  debug('Environment:', ENV);
  debug(`Listening on port ${PORT}`);
});

app.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      Logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      Logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Process uncaught exception
process.on('uncaughtException', function(err) {
  Logger.error((new Date).toUTCString() + ' uncaughtException:', err.message);
  Logger.error(err.stack);
});

module.exports = app;
