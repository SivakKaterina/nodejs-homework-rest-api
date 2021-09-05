const Joi = require('joi');
const mongoose = require('mongoose');

const validationCreateContacts = Joi.object({
 name: Joi.string()
    .pattern(/^[a-zA-Z' '\-()0-9]{3,30}$/)
    .required(),
  
  phone: Joi.string()
    .pattern(/^[' '\-()0-9]{3,30}$/)
    .required(),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
});

const validationUpdateContacts = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z' '\-()0-9]{3,30}$/)
    .optional(),
  
  phone: Joi.string()
    .pattern(/^[' '\-()0-9]{3,30}$/)
    .optional(),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).optional()
}).or('name', 'phone', 'email');

const validationUpdateStatusContact = Joi.object({
  favorite: Joi.boolean().required(),
});

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  }
  catch (err) {
    next({
      status: 400,
      message: err.message,
    })
  }
};

module.exports = {
  createValidation: (req, res, next) => {
    return validate(validationCreateContacts, req.body, next)
  },
  updateValidation: (req, res, next) => {
    return validate(validationUpdateContacts, req.body, next)
  },
  updateStatusValidation: (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Missing field favorite',
      });
    }
    return validate(validationUpdateStatusContact, req.body, next);
  },
  validateMongoId: (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.contactId)) {
      return next({
        status: 400,
        message: 'Invalid ObjectId',
      });
    }
    next();
  },
};