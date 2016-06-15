import * as test from 'tape';
import * as nconf from 'nconf';
import * as Sequelize from 'sequelize';

const defaults = {
  dbHost: 'localhost',
  dbPort: 3306,
  dbName: 'test',
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

test('Api DB Tests', (t: test.Test) => {
  const connection: Sequelize.Sequelize = api.Connect();

  connection.validate().then((err: Sequelize.ValidationError) : void => {
    if (err) {
      t.error(err);
    }

    const user = api.User(connection);
    const data = {
      email: 'hicham.elhammouchi@gmail.com',
      password: '12345',
      firstName: 'Hicham',
      middleName: 'M',
      lastName: 'El Hammouchi',
    };

    user.sync({force: true}).then((theUser: Sequelize.Model<any, any>) : void | PromiseLike<any> => {
      if (!theUser && typeof theUser.create !== 'function') {
        t.error('user.sync failed');
        connection.close();
        t.end();
        return;
      }

      // Create and add data to DB
      return theUser.create(data);

    }).then((result: Sequelize.Instance<any>) : void => {
      if (!result && typeof result.get !== 'function') {
        t.error('Getting result failed');
        connection.close();
        t.end();
        return;
      }

      const theResult = result.get();
      t.equal(theResult.email, data.email, 'Check if email saved correctly');
      t.equal(theResult.password, data.password, 'Check if password saved correctly');
      t.equal(theResult.firstName, data.firstName, 'Check if first name saved correctly');
      t.equal(theResult.middleName, data.middleName, 'Check if middle name saved correctly');
      t.equal(theResult.lastName, data.lastName, 'Check if last name saved correctly');

      connection.close();
      t.end();
    });
  });
});

