import { validate, Joi } from 'express-validation';

export const create = validate(
  {
    body: Joi.object({
      name: Joi.string().required(),
    }),
  },
  {},
  { abortEarly: true }
);

export const get = validate(
  {
    params: Joi.object({ profileID: Joi.string() }),
  },
  {},
  { abortEarly: true }
);

export const update = validate(
  {
    params: Joi.object({ profileID: Joi.string() }),
    body: Joi.object({
      name: Joi.string(),
      created: Joi.date(),
      updated: Joi.date(),
      socials: Joi.array().items({
        type: Joi.string()
          .valid('github', 'facebook', 'snapchat', 'instagram', 'devpost', 'other')
          .required(),
        url: Joi.string().required(),
      }),
    }),
  },
  {},
  { abortEarly: true }
);

export const remove = validate(
  { params: Joi.object({ profileID: Joi.string() }) },
  {},
  { abortEarly: true }
);
