import * as express from 'express';
import * as cors from 'cors';

import { Firestore } from '@google-cloud/firestore';
import { Storage } from '@google-cloud/storage';

import {
  notFoundErrorHandler,
  errorDecorator,
  finalErrorHandler,
} from '../../lib/middlewares/error';

import { QRCodeService } from '../../core/qrcode/service/qrcode.service';
import { QRCodeRepository } from '../../core/qrcode/repository/gcs/qrcode.repository';

import { SocialRepository } from '../../core/social/repository/firestore/social.repository';

import { ProfileService } from '../../core/profile/service/profile.service';
import { ProfileRepository } from '../../core/profile/repository/firestore/profile.repository';
import { ProfileHandler } from '../../core/profile/delivery/http/profile.handler';

const firestore = new Firestore();
const storage = new Storage();

const init = async (): Promise<express.Express> => {
  const qrr = new QRCodeRepository(storage);
  const qrs = new QRCodeService(qrr);
  await qrs.init();

  const sr = new SocialRepository(firestore);

  const pr = new ProfileRepository(firestore, sr);
  const ps = new ProfileService(pr, qrs);
  const ph = new ProfileHandler(ps);

  const app = express();

  app.set('env', process.env.NODE_ENV);

  app.set('trust proxy', true);

  app.use(cors());

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/profiles', ph.router());

  app.use(notFoundErrorHandler);

  app.use(errorDecorator);

  app.use(finalErrorHandler);

  return app;
};

export default init();
