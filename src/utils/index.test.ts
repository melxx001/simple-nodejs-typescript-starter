import * as test from 'tape';
import * as utils from './index';
import {LoggerInstance} from 'winston';
import * as request from 'supertest';
import * as express from 'express';

test('Utils Tests', (t) => {

  let logger = utils.Logger;
  // Logger Tests
  if (!logger) {
    t.error('logger is undefined');
  } else {
    t.equal(typeof logger, 'object', 'Check if logger object exists');
    t.equal(typeof logger.debug, 'function', 'Check if logger function debug() exists');
    t.equal(typeof logger.info, 'function', 'Check if logger function info() exists');
    t.equal(typeof logger.warn, 'function', 'Check if logger function warn() exists');
    t.equal(typeof logger.error, 'function', 'Check if logger function error() exists');
    t.equal(typeof logger.log, 'function', 'Check if logger function log() exists');
  }

  // Debug function test
  let debug = utils.Debug;
  if (!debug) {
    t.error('debug is undefined');
  } else {
    t.equal(typeof debug, 'function', 'Check if debug function exists');
  }

  // Test Logger Middleware
  let loggerMiddleware = utils.LoggerMiddleware;
  if (!loggerMiddleware) {
    t.error('loggerMiddleware is undefined');
  } else {
    let createServer = (logr: LoggerInstance) => {
      let app = express();
      logr.level = 'info';
      app.use(loggerMiddleware(logr));

      app.get('/', (req, res) => {
        res.status(200).json({ completed: true });
      });

      return app;
    };

    let app = createServer(utils.Logger);

    utils.Logger.once('logged', (level, message, data) => {
       if (!(data.statusCode && data.method && data.url && data.responseTime && data.ip && data.userAgent)) {
         t.error('loggerMiddleware did not returned the correct data');
       } else {
         t.pass('Check if loggerMiddleware outputs correctly');
       }
    });

    request(app).get('/').end((err, res) => {
      if (err) {
        throw err;
      }
    });
  }

  t.equal(typeof debug, 'function', 'another test');
  t.end(); // end the test
});
