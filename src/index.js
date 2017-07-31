const app = require('./config/express');
const { env, port } = require('./config/vars');
const { logger } = require('./api/utils/logger');

/*
 * Entry point
 */
app.listen(port, () => logger.info(`Server started on port ${port} (${env})`));

module.exports = app;
