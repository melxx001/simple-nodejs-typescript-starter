import * as test from 'tape';
import * as nconf from 'nconf';
import * as Sequelize from 'sequelize';

const defaults = {
  dbHost: 'localhost',
  dbPort: 3306,
  dbName: 'dev',
  dbUserName: 'root',
  dbPassword: 'root',
  dbDriver: 'mysql',
  dbPool: {
    maxConnections: 5,
    minConnections: 0,
    maxIdleTime: 10000,
  },
};

nconf.defaults(defaults);

import * as api from './index';

test('Api Config Tests', (t: test.Test) => {
  t.equal(typeof api.Connect, 'function', 'Check if Connect function exists');
  t.equal(api.DefaultDbConfig.dbName, defaults.dbName, 'Check if default database name exists');
  t.equal(api.DefaultDbConfig.dbHost, defaults.dbHost, 'Check if default host value exists');
  t.equal(api.DefaultDbConfig.dbPort, defaults.dbPort, 'Check if default port value exists');
  t.equal(api.DefaultDbConfig.dbUserName, defaults.dbUserName, 'Check if default username value exists');
  t.equal(api.DefaultDbConfig.dbPassword, defaults.dbPassword, 'Check if default pasword value exists');
  t.equal(api.DefaultDbConfig.dbDriver, defaults.dbDriver, 'Check if default driver value exists');
  t.deepEqual(api.DefaultDbConfig.dbPool, defaults.dbPool, 'Check if default pool values exists');
  t.end();
});

test('Api DB Connection Tests', (t: test.Test) => {
  const connection: Sequelize.Sequelize = api.Connect();
  if (connection.validate()) {
    t.equals(connection.getDialect(), defaults.dbDriver, 'Check connection driver');
  } else {
    t.error('No connection to DB');
  }

  t.end();
});
