'use strict';

import {Logger, LoggerInstance, transports} from 'winston';
import * as nconf from 'nconf';

const logLevel = nconf.get('logLevel');
const logInJson = nconf.get('logInJson');

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
const logger = new Logger({
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
const dbg = (name: string) => {
  const appName = nconf.get('appName');
  return require('debug')(`${appName}:${name}`);
};

const debugLog = dbg('utils');
debugLog('logLevel', logLevel);
debugLog('logInJson', logInJson);

// Logger middleware where we can capture all the data we want
const loggerMiddleware = (logr: LoggerInstance) => {
  const url = require('url');
  const events = require('events');

  return (req: any, res: any, next: any) : any => {
    let requestEnd = res.end;
    let requestedUrl: string = url.parse(req.originalUrl);
    let startTime: any  = new Date();
    let userAgent: string = req.get('User-Agent');

    res.end = (chunk, encoding) => {
      let time: any = new Date();
      let data: any = {
        'statusCode': res.statusCode,
        'method': req.method,
        'responseTime': (time - startTime).toString(),
        'url': req.originalUrl,
        requestedUrl,
        'ip': req.headers['x-forwarded-for'] || req.ip,
        'userAgent': userAgent
      };

      res.end = requestEnd;
      res.end(chunk, encoding);

      logr.info(data);
    };

    next();
  };
};

export {
  logger as Logger,
  loggerMiddleware as LoggerMiddleware,
  dbg as Debug
};

