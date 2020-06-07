import { Handler, Request, Response, NextFunction } from 'express';

export const asyncMiddleware = (fn: Handler): Handler => (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};
