import { Handler } from 'express';

export const asyncMiddleware = (fn: Handler): Handler => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};
