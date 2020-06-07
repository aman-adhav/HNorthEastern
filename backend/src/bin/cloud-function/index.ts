import { Express, Request, Response } from 'express';

import init from '../app';

let app: Express;

export const api = (req: Request, res: Response) => {
  if (!app) {
    init()
      .then((express) => {
        app = express;
        app(req, res);
      })
      .catch((error) => {
        throw error;
      });
  } else app(req, res);
};
