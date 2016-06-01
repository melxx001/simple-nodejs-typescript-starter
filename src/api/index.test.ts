import * as test from 'tape';
import * as nconf from 'nconf';

nconf.defaults({
  dbHost: 'localhost',
  dbName: 'dev',
  dbUser: 'root',
  dbPassword: 'root',
  dbDialect: 'mysql',
  dbPool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

import * as api from './index';

test('Api Tests', (t) => {
  t.pass('test');
  t.end();
});
