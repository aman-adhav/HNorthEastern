import { Handler } from 'express';
import * as boom from '@hapi/boom';

import admin from 'firebase-admin';
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

export const authMiddleware: Handler = (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    next(boom.forbidden());
    return;
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
      next(boom.unauthorized());
    });
};
