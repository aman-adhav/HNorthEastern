import { Handler, Router } from 'express';
import * as express from 'express';

import { asyncMiddleware } from '../../../../lib/middlewares/async';

import * as domain from '../../../domain';

export class ProfileHandler {
  constructor(private service: domain.ProfileService) {}

  router(): Router {
    const router = express.Router();

    router.post('/', asyncMiddleware(this.create));
    router.get('/:profileID', asyncMiddleware(this.get));
    router.put('/:profileID', asyncMiddleware(this.update));
    router.delete('/:profileID', asyncMiddleware(this.delete));

    return router;
  }

  create: Handler = async (req, res, next) => {
    const id = await this.service.create(req.body);
    res.json(id);
  };

  get: Handler = async (req, res, next) => {
    const profile = await this.service.get(req.params.profileID);
    res.status(201).json(profile);
  };

  update: Handler = async (req, res, next) => {
    const profile: domain.Profile = { id: req.params.profileID, ...req.body };
    await this.service.update(profile);
    res.sendStatus(204);
  };

  delete: Handler = async (req, res, next) => {
    await this.service.delete(req.params.profileID);
    res.sendStatus(204);
  };
}
