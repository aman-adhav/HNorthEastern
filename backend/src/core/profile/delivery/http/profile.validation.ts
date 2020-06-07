import { validate, Joi } from 'express-validation';

export const create = validate(
  {
    body: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      socials: Joi.array()
        .items({
          type: Joi.string()
            .valid('github', 'facebook', 'snapchat', 'instagram', 'devpost', 'other', 'devpost')
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
    body: Joi.object({
      name: Joi.string(),
      description: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
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
          url: Joi.string(),
        })
        .max(5),
    }),
  },
  {},
  { abortEarly: true }
);

export const remove = validate({ body: Joi.object({}) }, {}, { abortEarly: true });
