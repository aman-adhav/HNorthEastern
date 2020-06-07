import { Handler, Request, Router } from 'express';
import * as express from 'express';
import * as boom from '@hapi/boom';

import { asyncMiddleware } from '../../../../lib/middlewares/async';
import { authMiddleware } from '../../../../lib/middlewares/auth';
import * as domain from '../../../domain';

import * as validation from './profile.validation';

export class ProfileHandler {
  constructor(private service: domain.ProfileService) {}

  router(): Router {
    const router = express.Router();

    router.post('/', authMiddleware, validation.create, asyncMiddleware(this.create));
    router.get('/:profileID', validation.get, asyncMiddleware(this.get));
    router.put('/', authMiddleware, validation.update, asyncMiddleware(this.update));
    router.delete('/', authMiddleware, validation.remove, asyncMiddleware(this.remove));

    return router;
  }

  create: Handler = async (req: Request, res) => {
    if (!req.user || !req.user.uid) throw boom.forbidden();

    const profile = await this.service.create({ ...req.body, id: req.user.uid });
    if (profile.socials.length) {
      profile.socials.forEach((social) => {
        delete social.image.uri;
      });
    }
    delete profile.qr.uri;
    res.json(profile);
  };

  get: Handler = async (req, res) => {
    const profile = await this.service.get(req.params.profileID);
    if (profile.socials.length) {
      profile.socials.forEach((social) => {
        delete social.image.uri;
      });
    }
    delete profile.qr.uri;
    res.status(201).json(profile);
  };

  update: Handler = async (req, res) => {
    if (!req.user || !req.user.uid) throw boom.forbidden();

    const profile: domain.Profile = { ...req.body, id: req.user.uid };
    await this.service.update(profile);
    res.sendStatus(204);
  };

  remove: Handler = async (req, res) => {
    if (!req.user || !req.user.uid) throw boom.forbidden();

    await this.service.remove(req.user.uid);
    res.sendStatus(204);
  };
}
