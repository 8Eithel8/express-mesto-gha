const { celebrate, Joi } = require('celebrate');
const { isEmail, isURL } = require('validator');
const BadRequestError = require('../errors/bad-request-error');

const validateUrl = (url) => {
  if (isURL(url, { require_protocol: true })) {
    return url;
  }
  throw new BadRequestError('Некорректно задан url-адрес в поле avatar.');
};

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateUrl),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports = { validateUser };
