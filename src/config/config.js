const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const isDockerContainer = process.env.DB_HOST === 'db' && String(process.env.DB_PORT) === '5432';

const dbHost = isDockerContainer ? 'db' : '127.0.0.1';
const dbPort = isDockerContainer ? 5432 : Number(process.env.POSTGRES_PORT || 5434);

const dbConfig = {
  username: String(process.env.DB_USER || process.env.POSTGRES_USER || 'postgres'),
  password: String(process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'secretpassword'),
  database: String(process.env.DB_NAME || process.env.POSTGRES_DB || 'db_user_geosandbox'),
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  logging: false
};

module.exports = {
  development: dbConfig,
  test: dbConfig,
  production: dbConfig
};