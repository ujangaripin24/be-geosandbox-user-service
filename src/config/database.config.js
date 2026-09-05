const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const isDocker = process.env.IS_DOCKER === 'true' || process.env.USER === 'node';
const dbHost = (process.env.DB_HOST === 'db' && !isDocker) ? '127.0.0.1' : (process.env.DB_HOST || '127.0.0.1');

const database = new Sequelize(
    process.env.DB_NAME || 'db_user_geosandbox',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'secretpassword',
    {
        host: dbHost,
        port: process.env.DB_PORT || 5434,
        dialect: 'postgres',
        logging: false
    }
);

module.exports = database;