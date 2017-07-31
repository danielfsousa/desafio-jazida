const httpStatus = require('http-status');
const expressValidation = require('express-validation');
const APIError = require('../utils/APIError');
const { env } = require('../../config/vars');

/**
 * Error handler
 * @public
 */
const handler = (err, req, res, next) => {
  const response = {
    code: err.status,
    message: err.message || httpStatus[err.status],
    errors: err.errors,
    stack: err.stack,
  };

  if (env !== 'development') {
    delete response.stack;
  }

  if (err.status >= 100 && err.status < 600) {
    res.status(err.status);
  } else {
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }

  if (!res.headersSent) {
    res.send(response);
  }
};
exports.handler = handler;

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
exports.converter = (err, req, res, next) => {
  let errorCopy = err;

  if (err instanceof expressValidation.ValidationError) {
    errorCopy = new APIError({
      message: 'Erro de Validação',
      errors: err.errors,
      status: err.status,
      stack: err.stack,
    });
  } else if (!(err instanceof APIError)) {
    errorCopy = new APIError({
      message: err.message,
      status: err.status,
      stack: err.stack,
    });
  }

  return handler(errorCopy, req, res);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
exports.notFound = (req, res, next) => {
  const err = new APIError({
    message: 'Não Encontrado',
    status: httpStatus.NOT_FOUND,
  });
  return handler(err, req, res);
};
