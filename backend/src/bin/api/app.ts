import * as express from 'express';
import * as cors from 'cors';

import { Firestore } from '@google-cloud/firestore';

import {
  notFoundErrorHandler,
  errorDecorator,
  finalErrorHandler,
} from '../../lib/middlewares/error';

import { ProfileService } from '../../core/profile/service/profile.service';
import { ProfileRepository } from '../../core/profile/repository/firestore/profile.repository';
import { ProfileHandler } from '../../core/profile/delivery/http/profile.handler';

const firestore = new Firestore();

const pr = new ProfileRepository(firestore);
const ps = new ProfileService(pr);
const ph = new ProfileHandler(ps);

const app = express();

app.set('env', process.env.NODE_ENV);

app.set('trust proxy', true);

app.use(cors());

app.use('/profiles', ph.router());

app.use(notFoundErrorHandler);

app.use(errorDecorator);

app.use(finalErrorHandler);

export default app;
