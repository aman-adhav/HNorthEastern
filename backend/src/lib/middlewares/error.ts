/*
 * Source: https://github.com/sandorTuranszky/production-ready-expressjs-server/blob/master/src/utils/errorMiddleware.js
 */

import { Handler, ErrorRequestHandler } from 'express';
import * as boom from '@hapi/boom';
import { ValidationError } from 'express-validation';

import log from '../log';

export const notFoundErrorHandler: Handler = (req, res, next) => {
  return next(boom.notFound('Route not found'));
};

export const errorDecorator: ErrorRequestHandler = (err, req, res, next) => {
  const options = {
    statusCode: err.isBoom ? err.statusCode : 500,

    decorate: {
      originalUrl: req.originalUrl,
      method: req.method,
      ip: req.ip,
    },
    data: {
      stack: err.stack || '',
      data: err.data || {},
    },
  };

  if (err instanceof ValidationError) {
    if (err.details.body?.length) err.message = err.details.body[0].message;
    else err.message = 'Invalid input';
    options.statusCode = 400;
  } else if (!err.isBoom) {
    if (process.env.NODE_ENV === 'production') err.message = null;
  }

  boom.boomify(err, options);

  next(err);
};

// eslint-disable-next-line consistent-return
export const finalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.isServer || process.env.NODE_ENV !== 'production') log.error({ error: err });

  if (res.headersSent) return next(err);

  // if (err.isDeveloperError) exitProcess();
  return res.status(err.output.statusCode).json(err.output.payload);
};
