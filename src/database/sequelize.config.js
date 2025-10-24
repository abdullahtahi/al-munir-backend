require('dotenv').config();
const env = process.env.NODE_ENV || 'development';

module.exports = {
  [env]: {
    username: process.env.DB_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: process.env.DB_DIALECT,
    client: process.env.DB_CLIENT,
    logging: false,
  },
};
