import { Handler, Router } from 'express';
import * as express from 'express';

import { asyncMiddleware } from '../../../../lib/middlewares/async';
import * as domain from '../../../domain';

import * as validation from './profile.validation';

export class ProfileHandler {
  constructor(private service: domain.ProfileService) {}

  router(): Router {
    const router = express.Router();

    router.post('/', validation.create, asyncMiddleware(this.create));
    router.get('/:profileID', validation.get, asyncMiddleware(this.get));
    router.put('/:profileID', validation.update, asyncMiddleware(this.update));
    router.delete('/:profileID', validation.remove, asyncMiddleware(this.remove));

    return router;
  }

  create: Handler = async (req, res) => {
    const profile = await this.service.create(req.body);
    res.json(profile);
  };

  get: Handler = async (req, res) => {
    const profile = await this.service.get(req.params.profileID);
    delete profile.qr.uri;
    res.status(201).json(profile);
  };

  update: Handler = async (req, res) => {
    const profile: domain.Profile = { id: req.params.profileID, ...req.body };
    await this.service.update(profile);
    res.sendStatus(204);
  };

  remove: Handler = async (req, res) => {
    await this.service.remove(req.params.profileID);
    res.sendStatus(204);
  };
}
