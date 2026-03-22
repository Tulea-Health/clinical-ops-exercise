import { celebrate, Joi } from "celebrate";

export const contactValidation = {
  create: celebrate({
    body: Joi.object({
      firstName: Joi.string().required().description("Contact's first name"),
      lastName: Joi.string().required().description("Contact's last name"),
      email: Joi.string().email().required().description("Contact's email address"),
    }),
  }),

  update: celebrate({
    params: Joi.object({
      id: Joi.number().required().description("Contact ID"),
    }),
    body: Joi.object({
      firstName: Joi.string().description("Updated first name"),
      lastName: Joi.string().description("Updated last name"),
      email: Joi.string().email().description("Updated email address"),
    }),
  }),
};
