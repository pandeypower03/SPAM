require('dotenv').config();
const { URL } = require('url');

const dbUrl = new URL(process.env.DATABASE_URL);

module.exports = {
  development: {
    username: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1),
    host: dbUrl.hostname,
    port: dbUrl.port,
    dialect: 'postgres'
  }
};
