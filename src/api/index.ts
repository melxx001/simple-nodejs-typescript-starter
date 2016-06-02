'use strict';

import * as nconf from 'nconf';
import * as Sequelize from 'sequelize';

const { Debug } = require('../utils');
const debug: Function = Debug('api');

interface DbConfig {
  dbHost: string;
  dbPort: number;
  dbName: string;
  dbUserName: string;
  dbPassword: string;
  dbDriver: string;
  dbPool: Sequelize.PoolOptions;
}

const dbHost: string = nconf.get('dbHost');
const dbPort: number = nconf.get('dbPort');
const dbName: string = nconf.get('dbName');
const dbUserName: string = nconf.get('dbUserName');
const dbPassword: string = nconf.get('dbPassword');
const dbDriver: string = nconf.get('dbDriver');
const dbPool: Sequelize.PoolOptions = nconf.get('dbPool');

const defaultDbConfig: DbConfig = {
  dbUserName: dbUserName,
  dbPassword: dbPassword,
  dbName: dbName,
  dbDriver: dbDriver,
  dbHost: dbHost,
  dbPort: dbPort,
  dbPool: dbPool,
};

const connect = (config: DbConfig = defaultDbConfig) : Sequelize.Sequelize => {
  debug('config', config);
  return new Sequelize(config.dbName, config.dbUserName, config.dbPassword, {
    host: config.dbHost,
    port: config.dbPort,
    dialect: config.dbDriver,
    pool: {
      maxConnections: config.dbPool.maxConnections,
      minConnections: config.dbPool.minConnections,
      maxIdleTime: config.dbPool.maxIdleTime,
    },
  });
};

export {
  connect as Connect,
  defaultDbConfig as DefaultDbConfig,
  DbConfig
};

