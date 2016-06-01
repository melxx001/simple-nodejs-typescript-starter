'use strict';

import * as nconf from 'nconf';

const { Debug } = require('../utils');
 

const dbHost = nconf.get('dbHost');
const dbName = nconf.get('dbName');
const dbUser = nconf.get('dbUser');
const dbPassword = nconf.get('dbPassword');
const dbDialect = nconf.get('dbDialect');
const dbPool = nconf.get('dbPool');
const debug = Debug('api');

debug('dbHost', dbHost);
debug('dbName', dbName);
debug('dbUser', dbUser);
debug('dbPassword', dbPassword);
debug('dbDialect', dbDialect);
debug('dbPool', dbPool);

export function test (value: number) {
  return value + 1;
};

