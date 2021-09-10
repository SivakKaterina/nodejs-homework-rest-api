const Joi = require('joi');
const HttpCode = require('../../../helpers/constants');


const validationCreateUser = Joi.object({
  password: Joi.string()
    .pattern(/[0-9a-zA-Z!@#$%^&*]{6,}/)
    .required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  subscription: Joi.string().optional(),
});

module.exports = {
  validationUser: (req, res, next) => {
    if ('password' in req.body && 'email' in req.body) {
      return validate(validationCreateUser, req.body, next);
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      message: 'Required field is not filled',
    });
  },
};