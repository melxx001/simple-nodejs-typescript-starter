'use strict';

import {Logger, LoggerInstance, transports} from 'winston';
import * as nconf from 'nconf';
import {Response, Request, RequestHandler} from 'express';

const logLevel: string = nconf.get('logLevel');
const logInJson: string = nconf.get('logInJson');
const lang: string = nconf.get('lang');

const customLevels = {
  levels: {
    debug: 5,
    info: 4,
    warn: 3,
    error: 2,
    fatal: 1,
    always: 0,
  },
  colors: {
    always: 'magenta',
  }
};

// Logger Setup
const logger : LoggerInstance = new Logger({
  transports: [
    new transports.Console({
      level: logLevel,
      handleExceptions: true,
      json: logInJson,
      colorize: true,
      timestamp: true,
    })],
  exitOnError: false,
  levels: customLevels.levels,
  colors: customLevels.colors,
});

// Set debug module with appName from configuration
const dbg: Function = (name: string) => {
  const appName = nconf.get('appName');
  return require('debug')(`${appName}:${name}`);
};

const debugLog : Function = dbg('utils');
debugLog('logLevel', logLevel);
debugLog('logInJson', logInJson);

// Logger middleware where we can capture all the data we want
const loggerMiddleware: Function = (logr: LoggerInstance) : Function => {
  const url = require('url');
  const events = require('events');

  return (req: Request, res: Response, next: Function) : void => {
    let requestEnd = res.end;
    let requestedUrl: string = url.parse(req.originalUrl);
    let startTime: Date  = new Date();
    let userAgent: string = req.get('User-Agent');

    res.end = (chunk?: any, encoding?: any) : void => {
      let time: Date = new Date();
      let data = {
        'statusCode': res.statusCode,
        'method': req.method,
        'responseTime': time.getTime() - startTime.getTime(),
        'url': req.originalUrl,
        requestedUrl,
        'ip': req.headers['x-forwarded-for'] || req.ip,
        'userAgent': userAgent,
        'language': req.query.lang || lang
      };

      res.end = requestEnd;
      res.end(chunk, encoding);

      logr.info('', data);
    };

    next();
  };
};

export {
  logger as Logger,
  loggerMiddleware as LoggerMiddleware,
  dbg as Debug
};

