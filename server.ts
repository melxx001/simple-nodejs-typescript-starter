'use strict';

// Can't use import here yet since harmony-modules
// Check out node --v8-options | grep harmony

import * as express from 'express';

const bodyParser = require('body-parser');
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
const ROOT: string = nconf.get('NODE_PATH');
const ENV: string = nconf.get('NODE_ENV');
const PORT: string = nconf.get('PORT');

// Helper variables
const isDev: Boolean = ENV === 'development';
const lang: string = nconf.get('lang');
const srcPath: string = `${ROOT}/src/`;
const views: string = path.join(srcPath, 'views');

// Utils Import
import {Logger, LoggerMiddleware, Debug} from './src/utils';
import * as CustomInterfaces from './src/utils/interfaces';

// Set debug function
const debug: Function = Debug('server');


debug('isDev', isDev);
debug('srcPath', srcPath);
debug('Views path', views);

// Express
const app: express.Express = express();

// view engine setup
app.engine('njk', nunjucks.render);
app.set('views', views);
app.set('view engine', 'njk');

const env = nunjucks.configure(views, {
  autoescape: true,
  watch: isDev,
  noCache: isDev,
  express: app,
});

// Configure localization
localization.configure({
  locales: ['en-US', 'es'],
  defaultLocale: 'en-US',
  cookie: 'lang',
  queryParameter: 'lang',
  directory: `${ROOT}/src/locales`,
  autoReload: isDev,
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
app.use((req: CustomInterfaces.CustomRequest, res: CustomInterfaces.CustomResponse, next: Function) : void => {
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
app.use((req: CustomInterfaces.CustomRequest, res: CustomInterfaces.CustomResponse) : void => {
  Logger.info('404 page not found');
  let err : CustomInterfaces.Error = new Error('Not Found');
  let data: CustomInterfaces.DevMessage = {
    dev_message: err.message,
    stack: err.stack,
    show: isDev,
  };

  let status: number = 404;

  res.status(status);
  res.render('errors/404', data);

  debug('%s params %s', status, JSON.stringify(data));
});

// development error handler
// will print stacktrace
app.use((err: CustomInterfaces.Error, req: CustomInterfaces.CustomRequest,
         res: CustomInterfaces.CustomResponse) : void => {
  let data: CustomInterfaces.DevMessage = {
    dev_message: err.message ? err.message : 'No Message',
    stack: err.stack,
    show: isDev,
  };

  let status: number = err.status || 500;

  res.status(status);
  Logger.error(err.stack);
  res.render('errors/error', data);

  debug('%s params %s', status, JSON.stringify(data));
});

// Start up the server
app.listen(PORT, (err?: any) : void  => {
  if (err) {
    Logger.error(err);
    return;
  }

  Logger.info('Environment:', ENV);
  Logger.info(`Listening on port ${PORT}`);

  debug('Environment:', ENV);
  debug(`Listening on port ${PORT}`);
});

process.on('error', (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind : string = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;

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
process.on('uncaughtException', function(err: CustomInterfaces.Error) {
  Logger.error((new Date).toUTCString() + ' uncaughtException:', err.message);
  Logger.error(err.stack);
});

module.exports = app;
