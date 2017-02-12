import * as test from 'tape';
import * as nconf from 'nconf';
import * as Sequelize from 'sequelize';

const defaults = {
  host: nconf.get('DB_HOST'),
  port: nconf.get('DB_PORT'),
  username: nconf.get('DB_USERNAME'),
  password: nconf.get('DB_PASSWORD'),
  database: nconf.get('DB_DATABASE_NAME'),
  dialect: nconf.get('DB_DIALECT'),
  pool: {
    max: nconf.get('DB_POOL_MAXCONNECTION'),
    min: nconf.get('DB_POOL_MINCONNECTION'),
    idle: nconf.get('DB_POOL_MAXIDLETIME'),
  },
  logging: nconf.get('DB_LOGGING')
};

import * as api from './index';

test('Api Config Tests', (t: test.Test) => {
  t.equal(typeof api.Connect, 'function', 'Check if Connect function exists');
  t.equal(api.DbConfig.database, defaults.database, 'Check if default database name exists');
  t.equal(api.DbConfig.host, defaults.host, 'Check if default host value exists');
  t.equal(api.DbConfig.port, defaults.port, 'Check if default port value exists');
  t.equal(api.DbConfig.username, defaults.username, 'Check if default username value exists');
  t.equal(api.DbConfig.password, defaults.password, 'Check if default pasword value exists');
  t.equal(api.DbConfig.dialect, defaults.dialect, 'Check if default driver value exists');
  t.deepEqual(api.DbConfig.pool, defaults.pool, 'Check if default pool values exists');
  t.end();
});

test('Api DB Connection Tests without config', (t: test.Test) => {
  const connection: Sequelize.Sequelize = api.Connect();

  connection.validate().then((err: Sequelize.ValidationError) : void => {
    if (err) {
      t.error(err);
    } else {
      t.pass('Check if successful connection');
    }
    connection.close();
    t.end();
  });
});

test('Api DB Connection Test with config', (t: test.Test) => {
  const connection: Sequelize.Sequelize = api.Connect(defaults);

  connection.validate().then((err: Sequelize.ValidationError) : void => {
    if (err) {
      t.error(err);
    } else {
      t.pass('Check if successful connection');
    }
    connection.close();
    t.end();
  });
});
