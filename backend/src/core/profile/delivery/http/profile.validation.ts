import { validate, Joi } from 'express-validation';

export const create = validate(
  {
    body: Joi.object({
      name: Joi.string().required(),
      socials: Joi.array()
        .items({
          type: Joi.string()
            .valid('github', 'facebook', 'snapchat', 'instagram', 'devpost', 'other')
            .required(),
          url: Joi.string().required(),
        })
        .max(5),
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
      qr: Joi.object({ url: Joi.string().required() }),
      socials: Joi.array()
        .items({
          type: Joi.string()
            .valid('github', 'facebook', 'snapchat', 'instagram', 'devpost', 'other')
            .required(),
          image: Joi.object({
            url: Joi.string().required(),
          }),
        })
        .max(5),
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
