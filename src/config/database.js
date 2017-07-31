const Sequelize = require('sequelize');
const { logger } = require('../api/utils/logger');
const { database, env } = require('./vars');

const sequelize = new Sequelize({
  dialect: database.vendor,
  dialectOptions: { encrypt: true },
  database: database.name,
  username: database.user,
  password: database.password,
  host: database.host,
  schema: database.schema,
  logging: env === 'DEBUG' ? console.log : false,
});

sequelize
  .authenticate()
  .then(() => {
    sequelize.sync();
    logger.info('Database connection has been established successfully.');
  })
  .catch((err) => {
    logger.error(`Database connection error: ${err}`);
    process.exit(-1);
  });

module.exports = sequelize;
