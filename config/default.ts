'use strict';

module.exports = {
  NODE_ENV: 'development',
  NODE_PATH: '.',
  PORT: 3000,

  // custom flags
  appName: 'Paws',
  logLevel: 'warn',
  logInJson: false,
  lang: 'en-US',

  DB_PORT: 3306,
  DB_USERNAME: 'root',
  DB_PASSWORD: 'root',
  DB_DATABASE_NAME: 'test',
  DB_HOST: 'localhost',
  DB_DIALECT: 'mysql',
  DB_POOL_MAXCONNECTION: 5,
  DB_POOL_MINCONNECTION: 0,
  DB_POOL_MAXIDLETIME: 10000,
  DB_LOGGING: true
};