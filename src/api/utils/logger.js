const winston = require('winston');
const logs = require('../../config/logs');

// create a winston instance
const logger = new winston.Logger(logs.winston);

// don't log on tests
if (process.env.NODE_ENV === 'test') {
  logger.remove(winston.transports.Console);
}

// logging requests with morgan
const stream = {
  write: (message) => {
    logger.info(`REQUEST ${message.slice(0, -1)}`);
  },
};

module.exports = { logger, stream };
