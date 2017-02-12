'use strict';

import * as nconf from 'nconf';
import * as Sequelize from 'sequelize';

const { Debug } = require('../utils');
const debug: Function = Debug('api');

interface DbConfigType {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  dialect: string;
  pool: Sequelize.PoolOptions;
  logging: boolean;
}

const dbConfig: DbConfigType = {
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

const connect = (config: any = dbConfig) : Sequelize.Sequelize => {
  debug('config', config);

  const connection = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    pool: {
      max: config.pool.maxConnections,
      min: config.pool.minConnections,
      idle: config.pool.maxIdleTime,
    },
    logging: config.logging
  });

  return connection;
};

export {
  connect as Connect,
  dbConfig as DbConfig,
  DbConfigType
};