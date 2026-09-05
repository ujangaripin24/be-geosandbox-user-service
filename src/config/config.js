const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const isDocker = process.env.IS_DOCKER === 'true' || process.env.USER === 'node';
const dbHost = (process.env.DB_HOST === 'db' && !isDocker) ? '127.0.0.1' : (process.env.DB_HOST || '127.0.0.1');

module.exports = {
  development: {
    username: process.env.DB_USER || process.env.POSTGRES_USER || 'postgres',
    password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'secretpassword',
    database: process.env.DB_NAME || process.env.POSTGRES_DB || 'db_user_geosandbox',
    host: dbHost,
    port: process.env.DB_PORT || process.env.POSTGRES_PORT || 5434,
    dialect: 'postgres',
    logging: false
  },
  test: {
    username: process.env.DB_USER || process.env.POSTGRES_USER || 'postgres',
    password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'secretpassword',
    database: process.env.DB_NAME || process.env.POSTGRES_DB || 'db_user_geosandbox',
    host: dbHost,
    port: process.env.DB_PORT || process.env.POSTGRES_PORT || 5434,
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: process.env.DB_USER || process.env.POSTGRES_USER || 'postgres',
    password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'secretpassword',
    database: process.env.DB_NAME || process.env.POSTGRES_DB || 'db_user_geosandbox',
    host: dbHost,
    port: process.env.DB_PORT || process.env.POSTGRES_PORT || 5434,
    dialect: 'postgres',
    logging: false
  }
};