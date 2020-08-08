const Joi = require("@hapi/joi");

const registerValidate = Joi.object({
  name: Joi.string().min(4).required(),
  username: Joi.string().min(4).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
});

const loginValidate = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(4).required(),
});

module.exports = {
  registerValidation: registerValidate,
  loginValidation: loginValidate,
};
