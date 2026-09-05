const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const database = new Sequelize(
    process.env.DB_NAME || 'db_user_geosandbox',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'secretpassword',
    {
        host: process.env.DB_HOST || 'db',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false
    }
);

module.exports = database;