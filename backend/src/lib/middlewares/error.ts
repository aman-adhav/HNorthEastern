/*
 * Source: https://github.com/sandorTuranszky/production-ready-expressjs-server/blob/master/src/utils/errorMiddleware.js
 */

import { Handler, ErrorRequestHandler } from 'express';
import * as boom from '@hapi/boom';

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
    },
  };

  boom.boomify(err, options);

  if (!err.isBoom) delete err.output.payload.message;

  next(err);
};

// eslint-disable-next-line consistent-return
export const finalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.isServer || process.env.NODE_ENV !== 'production') log.error({ error: err });

  if (res.headersSent) return next(err);

  // if (err.isDeveloperError) exitProcess();
  return res.status(err.output.statusCode).json(err.output.payload);
};
